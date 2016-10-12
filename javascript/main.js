// Hovering over a todo shows the red "X", and clicking on that "X" deletes the item


// (If you want, you could add a confirmation popup to this action using confirm(...))


// The incomplete item count should always be displayed in the bottom left corner (see mockup)


// Clicking on "Active" at the bottom nav results in only showing incomplete items


// Clicking on "Completed" at the bottom results in only showing complete items


// Clicking on "All" at the bottom results in showing all items, regardless of status


// Clicking "Clear completed" removes any todo item that is marked complete (delete from the UI)


var todoList = {
    values: {
        activeItems: [],
        completedItems: [],
        editTextIndex: null,
    },
};

//CONSTRUCTOR:////////////////////////////////////////////////////
function ListItem(newToDoText, checkStatus) {
    this.info = {
        status: checkStatus,
        toDoText: newToDoText
    };
    this.createElements = function() {
        var source = $("#todo-template").html();
        var template = Handlebars.compile(source);
        var context = {
            status: this.info.status,
            text: this.info.toDoText
        };
        var html = template(context);
        $('.list-container').append(html);
    };
    this.createElements();
}


//FUNCTIONS////////////////////////////////////////
function newList(listArray, checkStatus) {
    for (index = 0; index < listArray.length; index++) {
        newToDoText = listArray[index];
        new ListItem(newToDoText, checkStatus);
    }
}

function updateCount() {
    var count = todoList.values.activeItems.length;
    $('.incomplete-items').html(count);
}



//EVENT DELEGATORS://///////////////////////////////////////////////////
//complete:  Submit event to ListItem constructor
$('form').submit(function(event) {
    event.preventDefault();
    var newToDoText = $('.new-todo').val();
    $('.new-todo').val('');
    todoList.values.activeItems.push(newToDoText);
    updateCount();
    return new ListItem(newToDoText, "");
});

//complete: Clicking the checkbox toggles the check and toggles the status between 'completed' and 'active'
$('.main-container').on('change', '.checkbox', function(event) {
    var completedText = $(this).siblings('.edit-todo').val();
    if (this.checked) {
        var indexA = todoList.values.activeItems.indexOf(completedText);
        if (indexA > -1) {
            todoList.values.activeItems.splice(indexA, 1);
        }
        todoList.values.completedItems.push(completedText);
        $('.checkbox').prop('value', false);

    } else {
        var indexC = todoList.values.completedItems.indexOf(completedText);
        if (indexC > -1) {
            todoList.values.completedItems.splice(indexC, 1);
        }
        todoList.values.activeItems.push(completedText);
        $('.checkbox').prop('value', true);
    }
    updateCount();
});

//complete: Clicking the text of a todo list item allows edit
$('.main-container').on('click', '.edit-todo', function(event) {
    var preEditText = $(this).val();
    if ($(this).siblings('.checkbox').prop("checked")) {
        alert("Completed list items may not be edited");
    } else {
        var index = todoList.values.activeItems.indexOf(preEditText);
        todoList.values.editTextIndex = index;
        $(this).prop("readonly", false);
    }
});

//complete: Pressing Enter completes the edit
$('.main-container').on('keyup', '.edit-todo', function(event) {
    if (event.keyCode == 13) {
        var completedText = $(this).val();
        var index = todoList.values.editTextIndex;
        $(this).prop("readonly", true);
        if (~index) {
            todoList.values.activeItems[index] = completedText;
        }
    }
});

//Clicking status buttons in footer activates new list construction
// $('.show').on('click', '.show', function(event) {
$('.show-container').on('click', '.show', function(event) {
    $('.line-item').parent('').remove();
    if ($(this).is('.all')) {
        newList(todoList.values.activeItems, "");
        newList(todoList.values.completedItems, "checked");
    } else if ($(this).is('.current')) {
        newList(todoList.values.activeItems, "");
    } else {
        newList(todoList.values.completedItems, "checked");
    }
});

//Clicking "clear completed" does as advertised
$('footer').on('click', '.clear', function(event) {
    $('.line-item').parent('').remove();
    todoList.values.completedItems = [];
    newList(todoList.values.activeItems, "");
});

// complete: Clicking 'x' closes the list item
$('.main-container').on('click', '.delete', function(event) {
    $(this).parents('.items').slideUp(function() {
        $(this).remove();
        });
        var completedText = $(this).siblings('.edit-todo').val();
        console.log(completedText);
        if (this.checked) {
            var indexA = todoList.values.completedItems.indexOf(completedText);
            if (indexA > -1) {
                todoList.values.activeItems.splice(indexA, 1);
            }
        } else {
            var indexC = todoList.values.activeItems.indexOf(completedText);
            if (indexC > -1) {
                todoList.values.activeItems.splice(indexC, 1);
            }
        }
        updateCount();

});

//EPIC!!!
// localStorage.setItem('myCat', 'Tom');
