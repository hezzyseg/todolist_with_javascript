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
        if (teamMember=="" || taskName=="" || !dueDate){
            $('#error_message').text('Please choose a team member, write a task, and select a due date.');
            return;
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

        sortTasks(teamMember);

        //check if anything checked, if so add strikethrough
        $(document).on('change', 'input[type="checkbox"]', function() {
            if (this.checked) {
                $(this).closest('.task').css('text-decoration', 'line-through');
            } else {
                $(this).closest('.task').css('text-decoration', 'none');
            }
        });

        sortSectionsByName();      

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
    function sortTasks(teamMember) {
        // Get all tasks under the specific teammate
        let $tasks = $(`#todo_list .name:contains(${teamMember})`).nextUntil('.name'); 
    
        // Convert jQuery object to an array for sorting
        $tasks = $tasks.get();
    
        // Sort tasks by due date in ascending order
        $tasks.sort(function(a, b) {
            // Extract due date strings and parse them
            let dateA = new Date($(a).find('.due_date').text().replace('Due: ', '').trim());
            let dateB = new Date($(b).find('.due_date').text().replace('Due: ', '').trim());
            
            // Return comparison for ascending order
            return dateA - dateB; // Ascending order
        });
    
        // Clear current tasks and re-append the sorted tasks
        let $teammateSection = $(`#todo_list .name:contains(${teamMember})`);
        $teammateSection.nextUntil('.name').remove(); // Remove current tasks
    
        // Append sorted tasks back under the teammate's name
        $tasks.forEach(function(task) {
            $teammateSection.after(task); // Insert tasks after the name
        });
    }
    
    

    function sortSectionsByName() {
        let $names = $('#todo_list .name'); // Get all name sections
        
        let sortedSections = $names.get().sort(function(a, b) {
            return $(a).text().toLowerCase().localeCompare($(b).text().toLowerCase()); // Sort alphabetically
        });
        
        // Re-arrange the DOM based on the sorted order
        sortedSections.forEach(function(nameDiv) {
            let $nameDiv = $(nameDiv);
            let $tasks = $nameDiv.nextUntil('.name'); // Get all tasks under the current name
    
            // Append the name div and its associated tasks in sorted order
            $('#todo_list').append($nameDiv).append($tasks);
        });
    }
    
        
});
