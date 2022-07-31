function readURL(input, self, target) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(self).attr('src', e.target.result);
            $(target).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

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

$("#logo-img-upload").change(function() {
    readURL(this, "#default-selected-logo", ".default-logo-prev");
});