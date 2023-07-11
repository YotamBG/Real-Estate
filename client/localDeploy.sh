#!/bin/sh


print () {
 echo "$(date +"%T") $1";
 echo "$(date +"%T") $1">>log.txt;
}




print " ";
print "-----Starting local deployment-----";
cd /root/healthy-harvest/Real-Estate/client;
npm run build;
pm2 restart REC;
print "-----Finished local deployment-----";
