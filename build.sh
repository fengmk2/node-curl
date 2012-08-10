mkdir -p deps
cd deps
rm -rf curl
curl -o curl-7.27.0.tar.gz http://curl.haxx.se/download/curl-7.27.0.tar.gz
tar zxf curl-7.27.0.tar.gz
mv curl-7.27.0 curl
cd curl
./configure --without-ssl --disable-shared && make
cd ../..

node-gyp rebuild

SYSTEM=`uname -s`
EXTRA_FLAG="";
if [ $SYSTEM = "Darwin" ] ; then 
  # for mac    
  EXTRA_FLAG="-flat_namespace -undefined suppress"
  echo 'building for mac'
fi

gcc -o build/Release/node_curl.node build/Release/obj.target/node_curl/src/curl.o \
  build/Release/obj.target/node_curl/src/main.o \
  build/Release/obj.target/node_curl/src/request.o \
  "deps/curl/lib/.libs/libcurl.a" -shared $EXTRA_FLAG

rm -rf deps