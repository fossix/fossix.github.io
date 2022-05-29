$(document).ready(function() {
    $('a[href="' + location.pathname + '"]').closest('.list-group-item').addClass('list-group-item-secondary');
});
