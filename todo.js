window.onload = fetchTasks;  

function fetchTasks() {
    fetch('https://crudcrud.com/api/10beed6ae3e148418fad6f8a4e000f3c/todos')
        .then(response => response.json())
        .then(data => {
            renderTodoList(data);  
        })
        .catch(error => console.error('Error:', error));
}

function renderTodoList(tasks = []) {
    const todoListContainer = document.getElementById('todo-list');
    const doneListContainer = document.getElementById('done-list');
    todoListContainer.innerHTML = '';  
    doneListContainer.innerHTML = '';  
    tasks.forEach(function(item) {
        const itemElement = document.createElement('li');
        itemElement.textContent = item.task + ' - ' + item.description;

        const doneButton = document.createElement('button');
        doneButton.textContent = '✔️';
        doneButton.onclick = function() {
            markDone(item._id, itemElement); 
        };

        const removeButton = document.createElement('button');
        removeButton.textContent = '❌';
        removeButton.onclick = function() {
            removeItem(item._id, itemElement);  
        };

        itemElement.appendChild(doneButton);
        itemElement.appendChild(removeButton);

        if (item.done) {
            doneListContainer.appendChild(itemElement);  
        } else {
            todoListContainer.appendChild(itemElement);  
        }
    });
}

function addItem() {
    const todoInput = document.getElementById('todo-input');
    const descInput = document.getElementById('descript-input');

    if (todoInput.value && descInput.value) {
        const taskData = {
            task: todoInput.value,
            description: descInput.value,
            done: false  
        };

        fetch('https://crudcrud.com/api/10beed6ae3e148418fad6f8a4e000f3c/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            fetchTasks();  
        })
        .catch(function(error) {
            console.error('Error:', error);
        });

        todoInput.value = '';  
        descInput.value = '';
    }
}

function markDone(taskId, itemElement) {
    const taskData = { done: true }; 

    fetch('https://crudcrud.com/api/10beed6ae3e148418fad6f8a4e000f3c/todos/' + taskId, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        itemElement.remove();  
        document.getElementById('done-list').appendChild(itemElement);  

        itemElement.querySelector('button').remove();  

        fetchTasks();  
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
}

function removeItem(taskId, itemElement) {
    fetch('https://crudcrud.com/api/10beed6ae3e148418fad6f8a4e000f3c/todos/' + taskId, {
        method: 'DELETE',
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        itemElement.remove();  
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
}
