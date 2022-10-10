var canvas = null;
var ctx = null;
$(function(){
  canvas = document.getElementById( 'mycanvas' );
  ctx = canvas.getContext( '2d' );

  var file_image = document.getElementById( 'file-image' );
  file_image.addEventListener( 'change', selectReadFile, false );
});

function selectReadFile( e ){
  var file = e.target.files;
  var reader = new FileReader();
  //reader.readAsDataURL( file[0] );
  reader.onload = function(){
    readDrawImg( reader, canvas, 0, 0 );
  }
  reader.readAsDataURL( file[0] );
}

function readDrawImg( reader, canvas, x, y ){
  var img = readImg( reader );
  img.onload = function(){
    var w = img.width;
    var h = img.height;
    printWidthHeight( 'src-width-height', true, w, h );

    // resize
    var resize = resizeWidthHeight( 1024, w, h );
    printWidthHeight( 'dst-width-height', resize.flag, resize.w, resize.h );
    drawImgOnCav( canvas, img, x, y, resize.w, resize.h );
  }
}

function readImg( reader ){
  var result_dataURL = reader.result;
  var img = new Image();
  img.src = result_dataURL;

  return img;
}

function drawImgOnCav( canvas, img, x, y, w, h ){
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage( img, x, y, w, h );

  checkQRCode();
}

function resizeWidthHeight( target_length_px, w0, h0 ){
  var length = Math.max( w0, h0 );
  if( length <= target_length_px ){
    return({
      flag: false,
      w: w0,
      h: h0
    });
  }

  var w1;
  var h1;
  if( w0 >= h0 ){
    w1 = target_length_px;
    h1 = h0 * target_length_px / w0;
  }else{
    w1 = w0 * target_length_px / h0;
    h1 = target_length_px;
  }

  return({
    flag: true,
    w: parseInt( w1 ),
    h: parseInt( h1 )
  });
}

function printWidthHeight( width_height_id, flag, w, h ){
  var wh = document.getElementById( width_height_id );
  wh.innerHTML = '幅: ' + w + ', 高さ: ' + h;
}

function checkQRCode(){
  var imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );
  var code = jsQR( imageData.data, canvas.width, canvas.height );
  if( code ){
    //console.log( code );
    alert( code.data );
  }else{
    alert( "No QR Code found." );
  }
}