// functionallity for on canvas sliding sidebars
function onCanvas(){
  $('#show-right, #right').on('click', function(){
    console.log('showing right');
    $('body').toggleClass('show-right');
  });

  $('#show-nav, #nav').on('click', function(){
    console.log('showing nav');
    $('body').toggleClass('show-nav');
  });}