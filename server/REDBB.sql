--
-- PostgreSQL database dump
--

-- Dumped from database version 12.11
-- Dumped by pg_dump version 12.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    cart_id integer NOT NULL,
    user_id integer NOT NULL,
    total integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carts_id_seq OWNER TO postgres;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.cart_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    date timestamp with time zone NOT NULL,
    username character varying NOT NULL,
    cart_id integer NOT NULL,
    total integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.order_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying NOT NULL,
    price integer NOT NULL,
    category character varying,
    img character varying,
    description character varying
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.product_id;


--
-- Name: products_in_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_in_cart (
    product_id integer NOT NULL,
    cart_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.products_in_cart OWNER TO postgres;

--
-- Name: products_in_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_in_order (
    product_id integer NOT NULL,
    order_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.products_in_order OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying NOT NULL,
    password character varying,
    img character varying(255),
    google_id character varying,
    facebook_id character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.user_id;


--
-- Name: carts cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN cart_id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (cart_id, user_id, total) FROM stdin;
1	2	0
2	13	0
6	16	0
9	17	0
52	18	0
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, date, username, cart_id, total) FROM stdin;
11	2022-08-28 13:25:40.345327+03	bkbk	6	0
18	2022-08-28 15:50:40.006592+03	aviv	9	0
19	2022-08-28 16:02:31.36298+03	neta	10	0
20	2022-08-28 16:04:27.873073+03	neta	11	0
21	2022-08-28 16:12:48.606032+03	neta	12	0
22	2022-08-31 19:50:59.603986+03	neta	13	303
23	2022-08-31 19:59:05.605668+03	neta	14	353
24	2022-08-31 20:02:52.998199+03	neta	15	100
25	2022-08-31 20:03:37.190667+03	neta	15	50
26	2022-08-31 20:05:27.076721+03	neta	16	100
27	2022-08-31 20:08:32.877487+03	neta	17	200
28	2022-08-31 20:11:01.766201+03	neta	18	500
29	2022-08-31 20:12:09.320883+03	neta	19	100
30	2022-08-31 20:14:12.10845+03	neta	19	100
31	2022-08-31 20:15:22.641973+03	neta	20	100
32	2022-08-31 20:16:29.954435+03	neta	21	100
33	2022-08-31 20:18:04.484944+03	neta	21	50
34	2022-08-31 20:19:34.913149+03	neta	22	3
35	2022-08-31 20:21:50.034825+03	neta	23	100
36	2022-08-31 20:22:35.617544+03	neta	24	50
37	2022-08-31 20:23:14.209237+03	neta	25	100
38	2022-08-31 20:23:49.71892+03	neta	26	100
39	2022-08-31 20:24:25.896252+03	neta	26	250
40	2022-08-31 20:26:02.554522+03	neta	27	100
41	2022-08-31 20:26:49.350743+03	neta	28	100
42	2022-08-31 20:32:41.852426+03	neta	29	100
43	2022-08-31 20:33:13.63306+03	neta	30	3
44	2022-08-31 20:34:32.053327+03	neta	31	9
45	2022-08-31 20:36:22.775992+03	neta	32	200
46	2022-08-31 20:39:13.369474+03	neta	33	100
47	2022-08-31 20:44:04.888235+03	neta	33	50
48	2022-08-31 20:45:37.200368+03	neta	34	100
49	2022-08-31 20:46:33.672018+03	neta	35	100
50	2022-08-31 20:48:13.827622+03	neta	36	100
51	2022-08-31 20:49:23.854423+03	neta	37	50
52	2022-08-31 20:49:51.811376+03	neta	37	53
53	2022-08-31 20:53:59.539315+03	neta	38	50
54	2022-08-31 20:54:32.307427+03	neta	39	303
55	2022-08-31 20:57:26.533308+03	neta	40	100
56	2022-08-31 21:00:40.107277+03	neta	41	100
57	2022-08-31 21:01:03.40646+03	neta	41	200
58	2022-08-31 21:04:26.473574+03	neta	42	58
59	2022-08-31 21:34:57.461051+03	neta	42	200
60	2022-08-31 21:35:49.774253+03	neta	43	203
61	2022-08-31 21:37:26.010832+03	neta	44	300
62	2022-08-31 21:39:57.904401+03	neta	45	200
63	2022-08-31 21:45:00.280529+03	neta	46	100
64	2022-08-31 21:45:55.093869+03	neta	47	6
65	2022-08-31 21:46:28.257585+03	neta	48	300
66	2022-08-31 21:51:34.62387+03	neta	49	400
67	2022-09-02 04:10:57.868772+03	neta	50	406
68	2022-09-02 17:59:02.63519+03	neta	51	100
69	2023-03-18 21:37:23.840413+02	bad	53	32
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, name, price, category, img, description) FROM stdin;
1	TV	100	big	https://unsplash.com/photos/MP0bgaS_d1c/download?ixid=Mnw0MjM3MTF8MHwxfHNlYXJjaHwxfHxSZWFsJTIwRXN0YXRlfGVufDB8fHx8MTY3OTE2NTg1NA	\N
2	chair	3	small	https://unsplash.com/photos/UV81E0oXXWQ/download?ixid=Mnw0MjM3MTF8MHwxfHNlYXJjaHwyfHxSZWFsJTIwRXN0YXRlfGVufDB8fHx8MTY3OTE2NTg1NA	\N
3	computer	50	big	https://unsplash.com/photos/9rYfG8sWRVo/download?ixid=Mnw0MjM3MTF8MHwxfHNlYXJjaHwzfHxSZWFsJTIwRXN0YXRlfGVufDB8fHx8MTY3OTE2NTg1NA	\N
5	jaja	29	big	https://unsplash.com/photos/AQl-J19ocWE/download?ixid=Mnw0MjM3MTF8MHwxfHNlYXJjaHw0fHxSZWFsJTIwRXN0YXRlfGVufDB8fHx8MTY3OTE2NTg1NA	\N
6	string	0	string	https://unsplash.com/photos/h5QNclJUiA8/download?ixid=Mnw0MjM3MTF8MHwxfHNlYXJjaHw1fHxSZWFsJTIwRXN0YXRlfGVufDB8fHx8MTY3OTE2NTg1NA	\N
9	kwkw	20	sss	https://unsplash.com/photos/5i0GnoTTjSE/download?ixid=Mnw0MjM3MTF8MHwxfHNlYXJjaHw2fHxSZWFsJTIwRXN0YXRlfGVufDB8fHx8MTY3OTE2NTg1NA	\N
\.


--
-- Data for Name: products_in_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_in_cart (product_id, cart_id, quantity) FROM stdin;
1	2	1
2	2	1
3	1	1
1	52	1
1	9	1
2	9	1
2	6	1
3	6	1
5	6	1
1	6	2
\.


--
-- Data for Name: products_in_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_in_order (product_id, order_id, quantity) FROM stdin;
2	11	1
3	11	1
5	11	1
1	11	2
1	18	1
2	18	2
3	18	1
3	19	2
1	19	1
1	20	3
1	21	1
1	22	2
2	22	1
3	22	2
1	23	3
2	23	1
3	23	1
1	24	1
3	24	1
3	26	2
1	27	2
1	28	5
3	29	2
1	29	1
1	31	1
1	32	1
3	32	1
2	34	1
1	35	1
3	36	1
3	37	2
1	38	1
1	40	1
1	41	1
1	42	1
2	43	1
2	44	3
1	45	2
1	46	1
3	46	1
1	48	1
1	49	1
1	50	1
3	51	1
3	53	1
3	54	4
1	54	1
2	54	1
1	55	1
1	56	1
5	58	2
1	58	2
1	60	2
2	60	1
1	61	3
1	62	2
3	63	2
2	64	2
1	65	3
1	66	3
3	66	2
1	67	4
2	67	2
3	68	2
2	69	4
9	69	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password, img, google_id, facebook_id) FROM stdin;
1	ddd	vvvv	\N	\N	\N
66	gg	$2b$10$dTp86yrUC55tZBpNIwHC1.6t6m.6X7oTpcoc8xDixMwY97AvV3eYa	\N	\N	\N
2	yotam	ben-gera	\N	\N	\N
5	gali	ben	\N	\N	\N
6	goni	ben	\N	\N	\N
3	damn	$2b$10$T4eYAzWSzAwCvyfoyNTThOzBsvfatVkpIyMri0ItI3aCbdo.oP/4.	\N	\N	\N
13	jkjk	$2b$10$KVLtPAPMV/w9Kbuhvl.kcOWGwTWK3ZZbEYc3kx20rjRhOHehlhV5O	\N	\N	\N
16	bkbk	$2b$10$2NHkXJyzcEQfekuExZwEDuwFTWIj/0dT7QmCFZPLfdYLiydKdOcZC	\N	\N	\N
17	aviv	$2b$10$VtzjoL5Tupj3xPspLeJK..puhVSUhCBlbdgf20W2VDiOpRlq1NB9S	\N	\N	\N
18	neta	$2b$10$lIY91YwA9qmS3gFPChwL3.GEZQe18dZ1uGHpG8RJV7jIQPNZE7UQC	\N	\N	\N
19	dddd	$2b$10$lXnk4kF8GMc.yXYgOeY90eBS1v5EEDETWWt5MvGefysKezJ72Ru/m	\N	\N	\N
20	beta	$2b$10$flgNwprmyQN8H6YqJfn9JebcEP.uCDrTAULyd5zKJ2sENT/.b8MOG	\N	\N	\N
65	badbunny	$2b$10$2Fpe5WnbrgQbE.R0fO0oW.pZl4iF.4JagYnSaKXuUBTrrQg8KTFq2	\N	\N	\N
80	Yotam Ben-Gera	\N	https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=5260822224040611&height=200&width=200&ext=1668709482&hash=AeSXNofLexqM5EGZCS4	\N	5260822224040611
81	יותם בן-גרא	\N	https://lh3.googleusercontent.com/a/ALm5wu3h9eiO0KlpZgc0uz9y5GdAfYettmK3zH3UYY4VMg4=s96-c	115927805157088910946	\N
82	bad	$2b$10$vPtKn.3bhsd90XpU1teQ6u/4G7R1I6tvv5U65RFrZGX6aJ/0oDH2e	\N	\N	\N
\.


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_id_seq', 53, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 69, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 76, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 82, true);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (cart_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: products_in_cart products_in_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_cart
    ADD CONSTRAINT products_in_cart_pkey PRIMARY KEY (product_id, cart_id);


--
-- Name: products_in_order products_in_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_order
    ADD CONSTRAINT products_in_order_pkey PRIMARY KEY (product_id, order_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: users users_facebook_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_facebook_id_key UNIQUE (facebook_id);


--
-- Name: users users_google_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: products_in_cart products_in_cart_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_cart
    ADD CONSTRAINT products_in_cart_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(cart_id);


--
-- Name: products_in_cart products_in_cart_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_cart
    ADD CONSTRAINT products_in_cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: products_in_order products_in_order_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_order
    ADD CONSTRAINT products_in_order_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- Name: products_in_order products_in_order_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_order
    ADD CONSTRAINT products_in_order_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- PostgreSQL database dump complete
--

