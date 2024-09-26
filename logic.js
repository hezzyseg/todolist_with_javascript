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
                //this written w/ chat gpt
                // Create a new option element and append it to the dropdown
                $('#choose_name').append(new Option(teammateName, teammateName));

                // Disable the "Assign to" default option
                $('#choose_name option[value=""]').prop('disabled', true);

                sortDropdown();

                // Clear the input field after adding the teammate
                $('#teammate_name').val('');

                // Clear any error message
                $('#error_message').text('');
            }

            else{
                $('#error_message').text('Teammate already exists!');
            }
        }

        //handle blank input
        else{
            $('#error_message').text('Teammate name cannot be blank.');
        }
    });

    // Function to sort dropdown options (written w/ ChatGPT)
    function sortDropdown() {
        let options = $('#choose_name option').not('[value=""]').get(); // Get all options except the default one
        options.sort(function(a, b) {
            return $(a).text().toLowerCase().localeCompare($(b).text().toLowerCase());
        });
        $('#choose_name').empty().append('<option value="" disabled selected>Assign to</option>').append(options); // Reappend sorted options
    }
});
