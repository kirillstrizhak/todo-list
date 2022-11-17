function searchTaskInit() {
    let input = document.querySelector('.searchTaskInput');
    let cancelButton = document.querySelector('.cancelSearchButton');
    cancelButton.addEventListener('click', () => {
        input.value = '';
    })
    input.addEventListener('input', () => {
        let value = input.value.trim();
        let filteredTasks = document.querySelectorAll('.task');
        let taskNames = document.querySelectorAll('.taskTitleText');
        if (value != '') {
            filteredTasks.forEach(task => {
                taskNames.forEach(name => {
                    if (name.innerText.search(value) == -1) {
                        task.classList.add('disabled');
                    } else {
                        task.classList.remove('disabled');
                    }
                })
            })
        } else {
            filteredTasks.forEach(task => {
                task.classList.remove('disabled');
            })
        }
    })
}