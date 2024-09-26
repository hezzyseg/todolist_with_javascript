$(document).ready(function() {
    $('#add').on('click', function() {
        let teammateName = $('#teammate_name').val().trim();

            
        if (teammateName) {

            // Check for duplicate
            let exists = false;
            $('#choose_name option').each(function() {
                if ($(this).val().toLowerCase() === teammateName.toLowerCase()) {
                    exists = true;
                }
            });

            if(!exists){
                // Create a new option element and append it to the dropdown
                $('#choose_name').append(new Option(teammateName, teammateName));

                // Disable the "Assign to" default option
                $('#choose_name option[value=""]').prop('disabled', true);

                // Clear the input field after adding the teammate
                $('#teammate_name').val('');

                // Clear any error message
                $('#error_message').text('');
            }

            else{
                $('#error_message').text('Teammate already exists!');
            }
        }
    });
});
