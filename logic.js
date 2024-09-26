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

    $('#assign').on('click', function() {

        let teamMember = $('#choose_name').val().trim();
        let taskName = $('#task').val().trim();
        let dueDate = $('#date_input').val().trim();

        //check if anything blank
        if (!teamMember || !taskName || !dueDate){
            $('#error_message').text('Please choose a team member, write a task, and select a due date.');
        }
        //check if due date is earlier than today
        let today = new Date().toISOString().split('T')[0]; 
        if (dueDate < today) {
            $('#error_message').text('Due date cannot be earlier than today!');
            return; // Exit if due date is in the past
        } else {
            $('#error_message').text('');
        }

        // remove no tasks message if tasks added
        if ($('#todo_list').text().includes('No tasks right now. Please add a teammate and assign a task.')) {
            $('#todo_list').html(''); // Clear the message
        }

        // find if teammate section already exists (written w/ help from ChatGPT)
        let $existingTeammateSection = $(`#todo_list .name:contains(${teamMember})`);
        if ($existingTeammateSection.length === 0) {
            // Create a new teammate section
            $('#todo_list').append(`
                <div class="name">${teamMember}</div>
                <div class="task">
                    <span class="task_name">${taskName}</span>
                    <span class="due_date">Due: ${dueDate} <input type="checkbox"></span>
                </div>
            `);
        } else {
            // append task since section already exists
            $existingTeammateSection.next().after(`
                <div class="task">
                    <span class="task_name">${taskName}</span>
                    <span class="due_date">Due: ${dueDate} <input type="checkbox"></span>
                </div>
            `);
        }

        sortTasks($existingTeammateSection.next().parent());


        // Clear the input fields
        $('#task').val('');
        $('#date_input').val('');
        $('#error_message').text(''); // Clear error message

        

    });

    // Function to sort dropdown options (written w/ ChatGPT)
    function sortDropdown() {
        let options = $('#choose_name option').not('[value=""]').get(); // Get all options except the default one
        options.sort(function(a, b) {
            return $(a).text().toLowerCase().localeCompare($(b).text().toLowerCase());
        });
        $('#choose_name').empty().append('<option value="" disabled selected>Assign to</option>').append(options); // Reappend sorted options
    }

    // function to sort tasks based on due date (chatGPT)
    function sortTasks(teammateSection) {
        let tasks = teammateSection.find('.task').toArray();
        tasks.sort((a, b) => {
            // Compare due dates in ascending order (earlier dates first)
            return $(a).data('due_date') < $(b).data('due_date') ? -1 : 1;
        });
        // Remove existing tasks and append sorted tasks
        teammateSection.find('.task').remove();
        teammateSection.append(tasks);
    }

});
