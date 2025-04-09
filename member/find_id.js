$(function(){
    
    $('#findId').click(function(e){
        e.preventDefault();
        const name = $('#name').val();
        const email = $('#email').val();
        const phone = $('#phone').val();
        console.log(name, email, phone);

    })

});

