$('.select-content-type-input').on('change', function () {
   
    if ($('input[name=select-project-video]:checked').val() == 'select-video') {
        $('#add-project').modal('hide');
        $('#new-project').modal('show');
    } else if ($('input[name=select-project-video]:checked').val() == 'select-project') {
        $('#new-project').modal('hide');
        $('#add-project').modal('show');
    } else {
        return;
    }
});