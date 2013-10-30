function initOnCanvas(){
  // $('#show-social, #social').on('click', function(){
  //   console.log('showing social');
  //   $('body').toggleClass('show-social');
  // });

  //$('#show-map, #map').on('click', function(){
  $('#content').on('click', function(){
    console.log('showing map');
    $('body').toggleClass('show-map');
  });
}