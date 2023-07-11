const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const checkAuthenticated = require('../utils/checkAuthenticated');
const nodemailer = require('nodemailer');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const sleep = ms => new Promise(r => setTimeout(r, ms * 1000));

//  UPDATE: switch items with form&bg_checks

/**
 * @swagger
 * definitions:
 *   Application:
 *     properties:
 *       Details:
 *        properties:
 *          app_id:
 *            type: integer
 *          prop_id:
 *            type: integer
 *          approved:
 *            type: boolean
 *          date:
 *           type: string
 *           format: date-time
 *          username:
 *           type: string
 *          price:
 *           type: integer
 *          signature:
 *           type: string
 *          status_name:
 *           type: string
 *          status:
 *           type: integer
 *          form:
 *           properties:
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             prop_id:
 *               type: integer
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             university:
 *               type: string
 *          background_checks:
 *           properties:
 *             rows:
 *               properties:
 *                  0:
 *                    properties:
 *                      app_id:
 *                        type: integer
 *                      resolved:
 *                        type: boolean
 *                      response:
 *                        properties:
 *                          data:
 *                            type: object
 *                          type:
 *                            type: string
 *                  1:
 *                    properties:
 *                      app_id:
 *                        type: integer
 *                      resolved:
 *                        type: boolean
 *                      response:
 *                        properties:
 *                          data:
 *                            type: object
 *                          type:
 *                            type: string
 *        required:
 *            - application_id
 *            - date
 *            - username
 *            - total
 *       items:
 *         type: array
 *         items:
 *            $ref: '#/definitions/Product'
 *     required:
 *         - Details
 *         - items
 */



const getToken = async (username) => {
    //check token -> if not - get new one
    const dbtoken = (await db.query('SELECT crs_token FROM users WHERE username = $1;', [username])).rows[0];
    const { crs_token } = dbtoken;
    const final = crs_token;

    // check /users/
    const response = await fetch(
        `https://mware-dev.crscreditapi.com/api/users`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${crs_token}`
            }
        }
    );
    // if (res.status == 401)
    if (response.status != 200) {
        // then /users/login
        const res = await fetch(
            `https://mware-dev.crscreditapi.com/api/users/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'demo-user-account',
                    password: 'tryCRSfr33!'
                })
            }
        );
        const data = await res.json();
        const new_crs_token = data.token;
        const final = new_crs_token;
        db.query('UPDATE users SET crs_token = $1 WHERE username = $2;', [new_crs_token, username]);
        return final;
    }
    return final;
};


/**
 * @swagger
 * /applications/{applicationId}:
 *   get:
 *     tags:
 *       - Applications
 *     description: Returns a single application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: applicationId
 *         description: application's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single application
 *         schema:
 *           $ref: '#/definitions/application'
 *       403:
 *         description: Not allowed to view another user's application
 *       404:
 *         description: application not found
 */

router.get('/:applicationId', async (req, res, next) => { //fix
    const application_id = parseInt(req.params.applicationId);

    db.query(`SELECT applications.app_id, applications.prop_id, applications.price, applications.status, applications.date, applications.username, statuses.status_name, forms.form, forms.type, forms.approved, forms.signature
            FROM background_checks, applications, statuses, forms
            WHERE applications.app_id = $1
            AND statuses.status_id = applications.status
            AND forms.app_id = applications.app_id
            AND background_checks.app_id = applications.app_id
            `, [application_id], async (err, result) => {
        if (err) {
            return next(err);
        }
        console.log('Showing one application');
        const Details = result.rows[0];
        const background_checks = await db.query(`SELECT applications.app_id, background_checks.response, background_checks.type, background_checks.resolved
        FROM background_checks, applications
        WHERE applications.app_id = $1
        AND background_checks.app_id = applications.app_id
        ORDER BY background_checks.type;`, [application_id]);
        var applicationView = { "Details": Details, 'background_checks': background_checks };
        if (result.rows.length == 0) {
            return res.status(404).send({ error: "No application found" });
        }
        return res.status(200).send(applicationView);
    })

});


/**
 * @swagger
 * /applications:
 *   get:
 *     tags:
 *       - Applications
 *     description: Returns all of a user's applications
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of applications
 *         schema:
 *           type: array
 *           items:
 *              $ref: '#/definitions/application'
 */
router.get('/', (req, res, next) => {
    db.query(`SELECT applications.app_id, applications.prop_id, applications.price, applications.status, applications.date, applications.username, statuses.status_name, forms.form, forms.type
            FROM applications
            JOIN statuses
            ON applications.status = statuses.status_id
            JOIN forms
            ON applications.app_id = forms.app_id
            `+ (req.user.username == process.env.ADMIN ? `` : ` WHERE applications.username = '${req.user.username}'` + `;`), (err, result) => { //separate into two queries (admin and regular)
        if (err) {
            console.log(err);
            return next(err);
        }
        console.log('Showing all applications');
        res.status(200).send(result.rows.sort((a, b) => b.app_id - a.app_id));
    })
});



/**
 * @swagger
 * /applications/new-app:
 *   post:
 *     tags:
 *       - Applications
 *     description: Submites a new application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: productId
 *         description: product's id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: form
 *         description: Form details
 *         in: body
 *         required: true
 *         type: object
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/new-app/:productId', (req, res, next) => {
    const { productId } = req.params;
    const { form } = req.body;

    //make sure product exists
    db.query('SELECT * FROM products WHERE product_id = $1;', [productId], (err, result) => {
        if (result.rows.length != 0) {
            const product = result.rows[0];
            db.query('INSERT INTO applications (prop_id, price, username, status) VALUES ($1, $2, $3, 1) RETURNING app_id;', [productId, product.price, form.email], (err, result) => {
                if (err) {
                    return next(err);
                }
                console.log('New product added to app: ', { "product_id": productId });
                console.log(result);
                db.query(`INSERT INTO forms (form, app_id, type) VALUES ($1, $2, 'intial');`, [form, result.rows[0].app_id]);
                db.query(`INSERT INTO background_checks (request, response, type, app_id) VALUES ($1, $2, $3, $4);`, [{ 'details': 'details' }, { 'data': 'data' }, 'credit', result.rows[0].app_id]);
                db.query(`INSERT INTO background_checks (request, response, type, app_id) VALUES ($1, $2, $3, $4);`, [{ 'details': 'details' }, { 'data': 'data' }, 'criminal', result.rows[0].app_id]);
                res.status(200).send({ message: 'Product added to app successfully!' });
            });
        } else {
            res.status(404).send({ error: 'Product doesn`t exists' });
        }
    });
});


/**
 * @swagger
 * /applications/new-bg-check/{applicationId}/{checkType}:
 *   post:
 *     tags:
 *       - Applications
 *     description: Submites new background check
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: applicationId
 *         description: application's id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: checkType
 *         description: Type of check
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully submitted
 */

router.post('/new-bg-check/:applicationId/:checkType', async (req, res, next) => {
    const applicationId = parseInt(req.params.applicationId);
    const checkType = String(req.params.checkType);
    const { details } = req.body;

    //check login
    const { username } = (await db.query(`SELECT username FROM applications WHERE app_id = $1`, [applicationId])).rows[0];
    const crs_token = await getToken(username);

    if (checkType == 'criminal') {
        const response = await fetch(
            `https://mware-dev.crscreditapi.com/api/criminal/new-request`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${crs_token}`
                },
                body: JSON.stringify({
                    reference: 'myRef123',  // details.reference
                    subjectInfo: {
                        last: 'Consumer',  // details.last
                        first: 'Jonathan',  // details.first
                        middle: '',  // details.middle
                        dob: '01-01-1982',  // details.dob
                        ssn: '666-44-3321',  // details.ssn
                        houseNumber: '1803',  // details.houseNumber
                        streetName: 'Norma',  // details.streetName
                        city: 'Cottonwood',  // details.city
                        state: 'CA',  // details.state
                        zip: '91502'  // details.zip
                    }
                })
            }
        );

        const data = await response.json();
        console.log(`data: ${JSON.stringify(data)}`);
        db.query(`UPDATE background_checks SET request = $1, response = $2, resolved = true WHERE app_id = $3 AND type = $4;`, [details, data, applicationId, checkType]);
        const body2 = { "status": '4' }; //update
        const response2 = await fetch(process.env.SERVER_URL + `/applications/${applicationId}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body2),
            credentials: 'include'
        });
        console.log(`response2: ${response2}`);
    }
    if (checkType == 'credit') {
        const response = await fetch(
            `https://mware-dev.crscreditapi.com/api/equifax/credit-report`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${crs_token}`
                },
                body: JSON.stringify({
                    firstName: 'ASAD', // details.firstName
                    lastName: 'YCSWL', // details.lastName
                    ssn: '666176062', // details.ssn
                    dob: '1985-05-06', // details.dob
                    houseNumber: '8615', // details.houseNumber
                    quadrant: 'NW', // details.quadrant
                    streetName: 'Black Tern', // details.streetName
                    streetType: 'LN', // details.streetType
                    city: 'HOUSTON', // details.city
                    state: 'TX', // details.state
                    zip: '77040', // details.zip
                    phone: '7135551212' // details.phone
                })
            }
        );

        const data = await response.json();
        console.log(`data: ${JSON.stringify(data)}`);
        db.query(`UPDATE background_checks SET request = $1, response = $2, resolved = true WHERE app_id = $3 AND type = $4;`, [details, data, applicationId, checkType]);

        const body3 = { "status": '3' }; //update
        const response3 = await fetch(process.env.SERVER_URL + `/applications/${applicationId}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body3),
            credentials: 'include'
        });
        console.log(`response2: ${response3}`);
    }
    res.status(200).send({ message: 'Background check intiated!' });
});


/**
 * @swagger
 * /applications/{applicationId}/sign:
 *   put:
 *     tags:
 *       - Applications
 *     description: Submits signature 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: applicationId
 *         description: application's id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: signature
 *         description: Signature data
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully submitted
 */

router.put('/:applicationId/sign', async (req, res) => {
    const application_id = parseInt(req.params.applicationId);
    var { signature } = req.body;
    await db.query('UPDATE forms SET signature = $1 WHERE app_id = $2;', [signature, application_id]);
    res.status(200).send({ 'msg': 'Updated successfully!' });
});




/**
 * @swagger
 * /applications/{productId}/update:
 *   put:
 *     tags:
 *       - Applications
 *     description: Updates an application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: applicationId
 *         description: application's id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: new_status
 *         description: New status
 *         in: body
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/:applicationId/update', async (req, res, next) => {
    const application_id = parseInt(req.params.applicationId);
    var new_status = parseInt(req.body.status);

    db.query('SELECT * FROM applications WHERE app_id = $1', [application_id], (err, result) => {
        if (err) {
            return next(err);
        }
        if (result.rows.length != 0) {
            const appDs = result.rows[0];
            db.query('UPDATE applications SET status = $1 WHERE app_id = $2;', [new_status, application_id], async (err, result) => {
                if (err) {
                    return next(err);
                }

                db.query(`UPDATE forms SET approved = $1 WHERE app_id = $2 AND type = 'intial';`, [(new_status > 1 ? 1 : -1), application_id]);


                try {
                    const statuses = ["Initiated", "Application form review", "Credit score check", "Criminal background check", "Pay insurance", "Sign lease", "Confirmed"];
                    const mailgun = new Mailgun(formData);
                    const mg = mailgun.client({
                        username: 'api',
                        key: '9c0955a28081a31e487cd0211865c014-81bd92f8-2ff25364',
                    });
                    mg.messages
                        .create('sandbox2e50fef8b16e40cfa1c2651ad05eff4d.mailgun.org', {
                            from: "Mailgun Sandbox <postmaster@sandbox2e50fef8b16e40cfa1c2651ad05eff4d.mailgun.org>",
                            to: ["wfjiolfjfwefoop@gmail.com"],
                            subject: `Application #${application_id}`,
                            // text: `Your new status is: ${statuses[new_status]}     \n\n\n\n ${JSON.stringify(appDs)}`,
                            html: `<h1>Your new status is: ${statuses[new_status]}</h1> \n\n\n\n <p>${JSON.stringify(appDs)}</p>`,
                        })
                        .then(msg => console.log(msg)) // logs response data
                        .catch(err => console.log(err)); // logs any error`;

                } catch (err) {
                    console.log(err);
                }



                //intiate CRS API call
                if (new_status == 2) {
                    await sleep(10);
                    const body = { "username": 'username', "password": 'password' }; //update
                    const response = await fetch(process.env.SERVER_URL + `/applications/new-bg-check/${application_id}/credit`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                        credentials: 'include'
                    });
                }
                if (new_status == 3) {
                    await sleep(10);
                    const body = { "username": 'username', "password": 'password' }; //update
                    const response = await fetch(process.env.SERVER_URL + `/applications/new-bg-check/${application_id}/criminal`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                        credentials: 'include'
                    });
                }

                res.status(200).send({ 'msg': 'Updated successfully!' });
            })
        } else {
            res.status(404).send({ error: 'No application found!' });
        }
    })
});


module.exports = router;