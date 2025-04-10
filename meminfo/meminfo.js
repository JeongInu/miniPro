$(function () {
  $('.nav-tabs .tab').on('click', function (e) {
    e.preventDefault();

    if ($(this).hasClass('active')) return;

    $('.nav-tabs .tab').removeClass('active');
    $(this).addClass('active');

    $('.tab-pane.active').slideUp(300, function () {
      $(this).removeClass('active');

      const target = $($(e.currentTarget).data('target'));
      target.slideDown(300).addClass('active');
    });
  });

  $('.tab-pane').hide();
  $('#order').show();
});