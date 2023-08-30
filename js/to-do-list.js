function checkToday() {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let now = { day: day, month: month, year: year };
    return now;
}

checkToday()

class TaskAdder {
    constructor() { }

    createToday() {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        let taskDate = { day: day, month: month, year: year };
        return taskDate;
    }

    dateHandler(task) {
        let dates = taskList.dates;
        const existDay = dates.find(date => date.day == task.createDate.day);
        const existMonth = dates.find(date => date.month == task.createDate.month);
        const existYear = dates.find(date => date.year == task.createDate.year);
        if (existDay && existMonth && existYear) {
            return
        } else {
            dates.push(task.createDate);
        }
    }

    createTask() {
        let taskDate = this.createToday();
        let taskCompleteDate = this.createToday();
        let addedTask = {
            title: ``, description: '', createDate: taskDate, completeDate: taskCompleteDate, group: 'No group', lastGroupNumber: 'none', subtasks: [], id: 1, isComplete: false
        };

        this.dateFormatHandler(addedTask)

        return addedTask;
    }

    renderNewTask(task) {
        let tasksArray = taskList.tasks;
        let taskEditors = document.querySelector(`.js-taskId${task.id - 1}`);

        if (task.title.length != 0) {
            taskEditors.remove();
            tasksArray.push(task);
        }

        if (tasksArray.indexOf(task) != 0) {
            let previewTaskIndex = tasksArray.indexOf(task) - 1;
            task.id += tasksArray[previewTaskIndex].id;
        }

        taskList.renderTasksInList(taskList.tasks);
        this.oneTimeOneAdding();
    }

    createAddingForm(task) {
        let noTasks = document.querySelector('.noTasks');
        if (noTasks) {
            noTasks.remove()
        }

        let editorId = task.id - 1;
        let list = document.querySelector('.taskList');
        list.insertAdjacentHTML('beforeend', newTask.renderEditor(task.title, editorId, task.description));
        taskList.resizeInputsWhenInput(task);

        let titleEditor = document.querySelector(`.js-titleEditor${editorId}`);
        titleEditor.addEventListener('input', () => {
            task.title = titleEditor.value;
            if (titleEditor.value.length <= 0) {
                document.querySelector(`.confirmAdding-btn${editorId}`).className = `taskConfirmAdding confirmAdding-btn${editorId} inactiveButton`
            } else {
                document.querySelector(`.confirmAdding-btn${editorId}`).className = `taskBtn taskConfirmAdding button confirmAdding-btn${editorId}`
            }
        })

        document.querySelector(`.confirmAdding-btn${editorId}`).addEventListener('click', () => {
            if (titleEditor.value.length > 0) {
                this.renderNewTask(task)
            }
        });
        document.querySelector(`.cancelAdding-btn${editorId}`).addEventListener('click', () => {
            document.querySelector(`.js-taskId${editorId}`).remove();
            let list = document.querySelector('.taskList');
            if (list) {
                let noTasks = document.querySelector('.noTasks');
                if (!noTasks && taskList.tasks.length <= 0) {
                    list.innerHTML = `<div class="noTasks">
                <div class="noTasksInfo">
                    <img src="./img/notepad.jpg" alt="notepad">
                    <span>You have not added any tasks yet. But it's never too late to do it!</span>
                </div>
            </div>`
                }
            }
            this.oneTimeOneAdding()
        });
    }

    oneTimeOneAdding() {
        let addButton = document.querySelector('.addTaskButton');
        let titleEditor = document.querySelector('.taskTitleEditor');
        if (titleEditor && addButton) {
            addButton.classList.add('hidden');
            addButton.style.transition = '0s'
        } else if (addButton) {
            addButton.classList.remove('hidden');
            addButton.style.transition = '0.2s'
        }
    }

    dateFormatHandler(task) {
        if (task.createDate.day < 10) {
            task.createDate.day = '0' + task.createDate.day;
        }

        // if (task.createDate.month < 10) {
        //     task.createDate.month = '0' + task.createDate.month;
        // }

        if (task.completeDate.day < 10) {
            task.completeDate.day = '0' + task.completeDate.day;
        }

        // if (task.completeDate.month < 10) {
        //     task.completeDate.month = '0' + task.completeDate.month;
        // }
    }

    attachTaskPopup(task) {
        const popupNotification = new Popup(task.title, task.description, task, new PopupGroups(task), new Calendar(task), new Subtasks);
        let popupOpener = document.querySelector(`.js-titleText${task.id}`);
        if (popupOpener) {
            popupOpener.addEventListener('click', () => {
                if (task.isComplete == false) {
                    popupNotification.show('taskModal', task.id)
                }
            });
        }
    }

    init() {
        let addTaskButton = document.querySelector('.addTaskButton');
        if (addTaskButton) {
            addTaskButton.addEventListener('click', () => this.createAddingForm(taskAdd.createTask()))
            addTaskButton.addEventListener('click', () => this.oneTimeOneAdding())
        }
    }
}

class Task {
    constructor() { }
    renderEditor(title, id, description) {
        return `
        <div class="task taskListView js-taskId${id}">
            <div class="task__header">
                <div class="taskTitle js-title${id}">
                <textarea class="taskTitleEditor js-titleEditor${id} inactiveText" type="text" maxlength="200" placeholder="Task title">${title}</textarea></p></div>
            </div> 
            <div class="task__body js-body${id}">
            <textarea class="taskDescrEditor js-descr${id}" placeholder="Description" maxlength="3000">${description}</textarea>
            </div>
            <div class="task__footer js-taskFooter${id}">
            <div style="display: none;" class="taskBtn taskSave button js-saveTask-btn${id}"><span>Save</i></span></div>
            <div class="taskConfirmAdding confirmAdding-btn${id} inactiveButton"><span>Add task</i></span></div>
            <div class="taskBtn taskCancelAdding button cancelAdding-btn${id}"><span>Cancel</i></span></div>
            </div>
        </div>
        `
    }

    render(title, id, description, date, group) {
        return `
        <div class="task taskListView js-taskId${id}">
            <div class="task__header">
                <div class="taskTitle js-title${id}"><p class="taskTitleText js-titleText${id}">${title}</p></div>
                <div style="display: none;" class="task__header__toolBar js-taskToolBar${id}">
                    <div class="completeTaskCircle js-completeCircle${id}"></div>
                    <div class="tools">
                        <div class="taskBtn taskDelete button js-delete-btn${id} taskTool"><span><i class="fa-solid fa-trash"></i></span></div>
                        <div class="taskBtn taskedit button js-edit-btn${id} taskTool"><span><i class="fa-solid fa-pencil"></i></span></div>
                    </div>
                </div> 
            </div> 
            <div class="task__body js-body${id}">
                <p class="taskDescrText inactiveText">${description}</p>
            </div>
            <div class="task__footer js-taskFooter${id}">
                <div  style="display: none;" class="taskBtn taskSave button js-saveTask-btn${id}"><span>Save</i></span></div>
            </div>
            <div class="task__footer js-taskInfo${id}">
                    <div><span>${date.day}.${date.month}.${date.year}</span>
                    <span class="js-taskGroupedLabel${id}"><span style="font-weight: bold; color: #ababab;">Group: </span>${group}</span>
                </div>
            </div>
        </div>
        `
    }

    renderGrouped(title, id, description) {
        return `
        <div class="task taskListView js-taskId${id}">
            <div class="task__header">
                <div class="taskTitle js-title${id}"><p class="taskTitleText js-titleText${id}">${title}</p></div>
                <div style="justify-content: end; z-index: 2; display: none; width: fit-content;" class="task__header__toolBar js-taskToolBar${id}">
                    <div class="taskBtn taskDelete button js-delete-btn${id}"><span><i class="fa-solid fa-trash"></i></span></div>
                    <div class="taskBtn taskedit button js-edit-btn${id}" style="margin: 5px;"><span><i class="fa-solid fa-pencil"></i></span></div>
                    <div class="taskBtn taskRemoveFromGroup button js-rfg-btn${id}"><span><i class="fa-solid fa-xmark"></i></span></div>
                </div> 
            </div> 
            <div class="task__body js-body${id}">
                <p class="taskDescrText inactiveText">${description}</p>
            </div>
            <div class="task__footer js-taskFooter${id}">
                <div  style="display: none;" class="taskBtn taskSave button js-saveTask-btn${id}"><span>Save</i></span></div>
            </div>
        </div>
        `
    }
}

class TaskList {
    constructor() {
        this.tasks = [];
        this.dates = [];
        this.completedTasks = [];
    }

    renderList() {
        document.querySelector('.adderAndFilters').innerHTML = `
        <div class="tasksActions">
                <div class="addTaskForm">
                <div class="button addTaskButton">+ Add new task</div>
            </div>
            <div class="searchTaskInGroup">
                <input type="text" placeholder="Enter task to find it..." style="height: 25px">
                <span><i class="fa-solid fa-magnifying-glass"></i></span>
            </div>
            <div class="taskFilters">
                <button class="button clearFiltersBtn disabled">Clear sorting</button>
                <div class="filter js-titleFilter"><span class="filterName">Title </span><div class="ascendDescend js-sortTitle"><i class="fa-solid fa-sort"></i></div></div>
                <div class="filter js-dateAddedFilter"><span class="filterName">Date added </span><div class="ascendDescend js-sortDateAdded"><i class="fa-solid fa-sort"></i></div></div>
                <div class="filter js-dateCompleteFilter"><span class="filterName">Date complete </span><div class="ascendDescend js-sortDateComplete"><i class="fa-solid fa-sort"></i></div></div>
            </div>
        </div>
        `
        this.renderTasksInList(this.tasks)

        taskAdd.init()
        filters.init()
    }

    renderTasksInList(tasksArray) {
        document.querySelector('.mainContentContainer').innerHTML = '<div class="taskList"></div>';
        let renderedTaskList = document.querySelector('.taskList');
        if (tasksArray.length > 0) {
            let emptyList = '';
            tasksArray.forEach(task => {
                emptyList += newTask.render(task.title, task.id, task.description, task.createDate, task.group);
                return emptyList;
            })
            renderedTaskList.innerHTML = emptyList;

            tasksArray.forEach((task) => {
                this.saveEditedTask(task);
                this.showOrHideToolBar(task);
                document.querySelector(`.js-delete-btn${task.id}`).addEventListener('click', () => this.removeTask(task));
                document.querySelector(`.js-edit-btn${task.id}`).addEventListener('click', () => this.oneTimeOneEdit(task));
                document.querySelector(`.js-saveTask-btn${task.id}`).addEventListener('click', () => this.saveEditedTask(task));
                document.querySelector(`.js-completeCircle${task.id}`).addEventListener('click', () => this.completeTask(task));
            })
        } else {
            renderedTaskList.innerHTML = `
            <div class="noTasks">
                <div class="noTasksInfo">
                    <img src="./img/notepad.jpg" alt="notepad">
                    <span>You have not added any tasks yet. But it's never too late to do it!</span>
                </div>
            </div>`
        }
    }

    renderTask(task) {
        if (taskList.tasks.indexOf(task) != 0) {
            let previewTask = taskList.tasks.indexOf(task) - 1;
            task.id += taskList.tasks[previewTask].id;
        }
        document.querySelector('.taskList').insertAdjacentHTML('beforeend', newTask.renderEditor(task.title, task.id, task.description));
    }

    renderDatedList(tasksArray) {

    }

    removeTask(task) {
        let addButton = document.querySelector('.addTaskButton');
        let tasksArray = taskList.tasks;
        let groupsArray = taskGroups.groups;
        tasksArray.splice(tasksArray.indexOf(task), 1);
        if (task.lastGroupNumber != 'none') {
            groupsArray[task.lastGroupNumber].tasks.splice(groupsArray[task.lastGroupNumber].tasks.indexOf(task), 1);
        }
        document.querySelector(`.js-taskId${task.id}`).remove()
        if (addButton) {
            this.deactivateAddButton()
        }

        let list = document.querySelector('.taskList');
        let groups = document.querySelector('.taskGroups');
        let noTasks = document.querySelector('.noTasks');

        let noGroupTasks = document.querySelector('.noGroupTasks');
        let groupTasksContainer = document.querySelector('.groupTasksContainer');
        if (list) {
            if (!noTasks && tasksArray.length <= 0) {
                list.innerHTML = `<div class="noTasks">
                <div class="noTasksInfo">
                    <img src="./img/notepad.jpg" alt="notepad">
                    <span>You have not added any tasks yet. But it's never too late to do it!</span>
                </div>
            </div>`
            }
        } else if (groups && task.lastGroupNumber != 'none') {
            let taskGroup = taskGroups.groups[task.lastGroupNumber];
            let tasksInGroup = taskGroup.tasks;
            if (!noGroupTasks && tasksInGroup.length <= 0) {
                groupTasksContainer.classList.add('centeredContent');
                groupTasksContainer.innerHTML = `
                <div class="noGroupTasks">
                    <img src="./img/notepad-empty.jpg" alt="noTasks">
                    <p>Group <span>${taskGroup.name}</span> is empty</p>
                </div>
                `
            }
        }
    }

    confirmTaskAdding(task) {
        let taskBodyEditor = document.querySelector(`.js-taskId${task.id}`);
        let taskList = document.querySelector('.taskList');

        if (task.title.length > 0) {
            taskBodyEditor.remove();
            taskList.insertAdjacentHTML('beforeend', newTask.render(task.title, task.id, task.description, task.createDate, task.group));
            let taskBody = document.querySelector(`.js-taskId${task.id}`);
            taskBody.style.cssText = `border: 1px solid transparent; border-bottom: 1px solid #dedede; border-radius: 0;`;
            document.querySelector(`.js-delete-btn${task.id}`).addEventListener('click', () => this.removeTask(task));
            document.querySelector(`.js-edit-btn${task.id}`).addEventListener('click', () => this.oneTimeOneEdit(task));
            document.querySelector(`.js-saveTask-btn${task.id}`).addEventListener('click', () => this.saveEditedTask(task));
        }

        taskAdd.attachTaskPopup(task);
        this.deactivateAddButton()
        this.showOrHideToolBar(task)
    }

    editTaskForm(task) {
        let taskBody = document.querySelector(`.js-taskId${task.id}`);
        let header = document.querySelector(`.js-title${task.id}`);
        let body = document.querySelector(`.js-body${task.id}`);
        taskBody.style.cssText = `border: 1px solid transparent; border: 1px solid #cdcdcd; border-radius: 10px; margin-bottom: 45px;`
        header.innerHTML = `
        <textarea class="taskTitleEditor inactiveText" type="text" maxlength="200" placeholder="Task title">${task.title}</textarea>`
        body.innerHTML = `
        <textarea class="taskDescrEditor js-descr${task.id}" placeholder="Description" maxlength="3000">${task.description}</textarea>
        `
        this.resizeInputsWhenInput(task);
        document.querySelector(`.js-saveTask-btn${task.id}`).style.display = 'flex';
        document.querySelector(`.js-saveTask-btn${task.id}`).addEventListener('click', () => this.saveEditedTask(task));
        let taskInfo = document.querySelector(`.js-taskInfo${task.id}`);
        if (taskInfo) {
            taskInfo.classList.add('disabled')
        }
        this.deactivateAddButton();

        let groupTasks = document.querySelector(`.tasksOfGroup`);
        if (groupTasks) {
            groupTasks.style.maxHeight = groupTasks.scrollHeight + 'px'
        }
    }

    resizeInputsWhenInput(task) {
        let titleEditor = document.querySelector('.taskTitleEditor');
        titleEditor.style.height = (titleEditor.scrollHeight / 2) + "px";
        titleEditor.addEventListener('input', () => {
            titleEditor.style.height = "1px";
            titleEditor.style.height = (titleEditor.scrollHeight) + "px";
            if (titleEditor.value <= 0) {
                task.title = 'Title'
            } else {
                task.title = titleEditor.value;
            }
        })
        let descriptionEditor = document.querySelector('.taskDescrEditor');
        descriptionEditor.style.height = (descriptionEditor.scrollHeight / 2) + "px";
        descriptionEditor.addEventListener('input', () => {
            descriptionEditor.style.height = "1px";
            descriptionEditor.style.height = (descriptionEditor.scrollHeight) + "px";
            if (descriptionEditor.value <= 0) {
                task.description = ''
            } else {
                task.description = descriptionEditor.value;
            }
        })
    }

    saveEditedTask(task) {
        let taskBody = document.querySelector(`.js-taskId${task.id}`);
        let taskFooter = document.querySelector(`.js-taskInfo${task.id}`);
        taskBody.style.cssText = `border: 1px solid transparent; border-bottom: 1px solid #dedede; border-radius: 0;`
        document.querySelector(`.js-saveTask-btn${task.id}`).style.display = 'none';
        document.querySelector(`.js-title${task.id}`).innerHTML = `<p class="taskTitleText js-titleText${task.id}">${task.title}</p>`;
        document.querySelector(`.js-body${task.id}`).innerHTML = `<p class="taskDescrText inactiveText">${task.description}</p>`;
        if (taskFooter) {
            taskFooter.classList.remove('disabled');
        }
        this.deactivateAddButton();
        taskAdd.attachTaskPopup(task);
    }

    oneTimeOneEdit(task) {
        let titleEditor = document.querySelector('.taskTitleEditor');
        if (!titleEditor) {
            this.deactivateEditButtons()
            this.editTaskForm(task)
        } else {
            console.log('cant edit')
        }
    }

    deactivateAddButton() {
        let addButton = document.querySelector('.addTaskButton');
        let titleEditor = document.querySelector('.taskTitleEditor');
        if (titleEditor && addButton) {
            addButton.style.transition = '0s'
            addButton.style.visibility = 'hidden';
        } else if (addButton) {
            addButton.style.transition = '0.2s'
            addButton.style.visibility = 'visible';
        }
    }

    deactivateEditButtons() {
        let toolBars = document.querySelectorAll(`.task__header__toolBar`);
        toolBars.forEach(toolBar => {
            toolBar.style.display = 'none';
        })
    }

    showOrHideToolBar(task) {
        let toolBar = document.querySelector(`.js-taskToolBar${task.id}`);
        let saveBtn = document.querySelector(`.js-saveTask-btn${task.id}`);
        let taskFooter = document.querySelector(`.js-taskFooter${task.id}`);
        let taskBlock = document.querySelector(`.js-taskId${task.id}`);
        taskBlock.addEventListener('mouseenter', (e) => {
            if (e.target == taskBlock && saveBtn.style.display !== 'flex') {
                toolBar.style.display = 'flex';
            }
        });
        taskBlock.addEventListener('mouseleave', (e) => {
            if (e.target == taskBlock) {
                toolBar.style.display = 'none';
            }
        })
    }

    completeTask(task) {
        let taskTitleCrossed = document.querySelector(`.js-titleText${task.id}`);
        let taskCompleteCircle = document.querySelector(`.js-completeCircle${task.id}`);
        if (taskCompleteCircle) {
            taskCompleteCircle.classList.add('hidden');
        }
        taskTitleCrossed.style.textDecoration = 'line-through'
        task.isComplete = true;

        setTimeout(() => {
            this.completedTasks.push(task);
            this.removeTask(task);
        }, 800)
    }

    init() {
        let renderedTaskList = document.querySelector('.taskList');
        this.renderList()
        if (!renderedTaskList) {
            document.querySelector('#alltasks').addEventListener('click', () => taskList.renderList());
        }
        taskGroups.searchTaskInGroupLive()
    }
}

class Group {
    constructor() { }

    render(name, number) {
        return `<div class="tasksGroup js-group${number}">
        <div class="groupInfo">
            <div class="groupInfo__header">
                <div class="groupInfo__toolbar js-groupToolbar${number}">
                    <div class="groupBtn button js-editGroupBtn${number}"><i class="fa-solid fa-pencil"></i></div>
                    <div class="groupBtn button js-deleteGroupBtn${number}"><i class="fa-solid fa-xmark"></i></div>
                </div>
            </div>
            <div class="groupInfo__body js-groupBody${number}">
                <p class="groupNameText">${name}</p>
            </div>
            <div class="groupBtn button js-saveGroupBtn${number} groupSaveBtn" style="display: none;">Save</div>
        </div>
    </div>`
    }
}

class TaskGroups {
    constructor() {
        this.groups = [];
    }

    renderGroupsList() {
        document.querySelector('.adderAndFilters').innerHTML = ``
        document.querySelector('.mainContentContainer').innerHTML = `
        <div class="taskGroups">
        <div class="groupsAndAdder">
            <div class="addNewGroup">
                <input class="groupNameInput" type="text" placeholder="Enter new group name..." maxlength="300">
                <button class="button addNewGroupButton"><span>+</span></button>
            </div>
            <p class="groupsTitle">Your groups</p>
            <div class="groups"></div>
        </div>
            <div class="tasksInGroup">
                <div class="groupTasksActions"></div>
                <p class="groupsTitle">Tasks in this group</p>
                <div class="groupTasksContainer centeredContent">
                    <p>Choose group or create new one</p>
                </div>
            </div>
        </div>
        `;
        document.querySelector('.addNewGroupButton').addEventListener('click', () => this.addGroup());
        let renderedGroupsList = document.querySelector('.groups');
        if (this.groups.length > 0) {
            let emptyGroupsList = '';
            this.groups.forEach(group => {
                emptyGroupsList += newGroupTemplate.render(group.name, group.number);
                return emptyGroupsList;
            });
            renderedGroupsList.innerHTML = emptyGroupsList;
        } else {
            renderedGroupsList.classList.add('centeredContent')
            renderedGroupsList.innerHTML = `
            <div class="noGroups">
                You have not created any groups yet, to create a group, click on the "+" button
            </div>
            `
        }
        this.groups.forEach(group => {
            let groupBlock = document.querySelector(`.js-group${group.number}`)
            groupBlock.addEventListener('click', (e) => {
                let saveBtn = document.querySelector(`.js-saveGroupBtn${group.number}`);
                let editBtn = document.querySelector(`.js-editGroupBtn${group.number}`);
                let nameEditor = document.querySelector(`.js-groupEditor${group.number}`);
                if (document.querySelector(`.js-group${group.number}`) && e.target != saveBtn && e.target != editBtn.firstChild && e.target != editBtn && e.target != nameEditor) {
                    this.renderTasksInGroup(group)
                    this.switchCurrentGroup(groupBlock)
                }
            });
            document.querySelector(`.js-editGroupBtn${group.number}`).addEventListener('click', () => this.editGroupName(group));
            document.querySelector(`.js-deleteGroupBtn${group.number}`).addEventListener('click', () => this.deleteGroup(group));
        })
    }

    renderTasksInGroup(group) {
        let isTaskMenuOpened = false;
        let groupTasksActions = document.querySelector('.groupTasksActions');
        groupTasksActions.innerHTML = `
                    <div class="searchTaskInGroup">
                        <input type="text" placeholder="Enter task to find it..." style="
                        height: 25px">
                        <span><i class="fa-solid fa-magnifying-glass"></i></span>
                    </div>
                    <div class="groupTasksButtons">
                    <button class="button addTaskToGroupBtn"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <div class="addingTasksMenu disabled">
                        <div class="tasksMenuBody"></div>
                        <div class="tasksMenuFooter">
                        <div>
                            <button class="button addChoosedTasks disabled">Add choosed tasks</button>
                        </div>
                        </div>
                    </div>
        `
        let menuOpenerButton = document.querySelector('.addTaskToGroupBtn');
        menuOpenerButton.addEventListener('click', () => {
            if (!isTaskMenuOpened) {
                isTaskMenuOpened = true;
                menuOpenerButton.firstChild.style.transform = 'rotate(135deg)';
                menuOpenerButton.firstChild.style.transition = '0.2s';
                choosingTaskMenu.openChoosingTaskMenu(group);
            } else {
                menuOpenerButton.firstChild.style.transform = null;
                choosingTaskMenu.closeChoosingTaskMenu(group);
                isTaskMenuOpened = false;
            }
        })

        let addChoosedTasksBtn = document.querySelector('.addChoosedTasks');
        addChoosedTasksBtn.addEventListener('click', () => choosingTaskMenu.addChoosedTasksToGroup(group));

        let groupTasksContainer = document.querySelector('.groupTasksContainer');
        groupTasksContainer.innerHTML = `<div class="groupTasksList js-tasksOfGroup${group.number}"></div>`;

        let groupTasksList = document.querySelector('.groupTasksList')
        if (group.tasks.length > 0) {
            groupTasksList.classList.remove('centeredContent');
            groupTasksContainer.classList.remove('centeredContent')
            let emptyGroup = '';
            group.tasks.forEach(task => {
                emptyGroup += newTask.renderGrouped(task.title, task.id, task.description);
                return emptyGroup;
            })
            groupTasksList.innerHTML = emptyGroup;
            group.tasks.forEach(task => {
                document.querySelector(`.js-delete-btn${task.id}`).addEventListener('click', () => taskList.removeTask(task));
                document.querySelector(`.js-edit-btn${task.id}`).addEventListener('click', () => taskList.oneTimeOneEdit(task));
                document.querySelector(`.js-saveTask-btn${task.id}`).addEventListener('click', () => taskList.saveEditedTask(task));
                document.querySelector(`.js-rfg-btn${task.id}`).addEventListener('click', () => this.removeTaskFromGroup(task, group));
                taskList.showOrHideToolBar(task);
                taskAdd.attachTaskPopup(task);
                taskList.saveEditedTask(task);
            })
        } else {
            groupTasksList.classList.add('centeredContent');
            groupTasksList.innerHTML = `
            <div class="noGroupTasks js-emptyGroup${group.number}">
                <img src="./img/notepad-empty.jpg" alt="noTasks">
                <p>This group is empty</p>
            </div>
            `
        }
        this.searchTaskInGroupLive()
    }

    render() {
        this.renderGroupsList();
    }

    createGroupName() {
        let groupInput = document.querySelector('.groupNameInput');
        let groupName = groupInput.value;
        return groupName;
    }

    editGroupName(group) {
        let groupBlock = document.querySelector(`.js-group${group.number}`);
        let groupBody = document.querySelector(`.js-groupBody${group.number}`);
        let saveBtn = document.querySelector(`.js-saveGroupBtn${group.number}`);
        let toolBar = document.querySelector(`.js-groupToolbar${group.number}`);

        groupBlock.style.marginBottom = '45px'

        groupBody.innerHTML = `
        <textarea class="groupNameEditor inactiveText js-groupEditor${group.number}" type="text" maxlength="100" placeholder="Group name">${group.name}</textarea>`;

        let nameEditor = document.querySelector(`.js-groupEditor${group.number}`);
        nameEditor.addEventListener('input', () => {
            if (nameEditor.value != '') {
                group.name = nameEditor.value;
                group.tasks.forEach(task => {
                    let taskInAllTasksArray = taskList.tasks.find(groupedTask => groupedTask.id == task.id);
                    taskInAllTasksArray.group = `${group.name}`
                })
            }
        })

        toolBar.style.display = 'none';
        saveBtn.style.display = 'flex';
        saveBtn.addEventListener('click', () => this.saveEditedGroup(group));
    }

    saveEditedGroup(group) {
        let groupBlock = document.querySelector(`.js-group${group.number}`);
        let groupBody = document.querySelector(`.js-groupBody${group.number}`);
        let toolBar = document.querySelector(`.js-groupToolbar${group.number}`);
        let saveBtn = document.querySelector(`.js-saveGroupBtn${group.number}`);
        groupBlock.style.marginBottom = null
        saveBtn.style.display = 'none';
        toolBar.style.display = 'flex';
        if (group.name.length > 0) {
            groupBody.innerHTML = `<p class="groupNameText js-groupNameText${group.number}">${group.name}</p>`;
        } else {
            groupBody.innerHTML = `<p class="groupNameText js-groupNameText${group.number}">Group</p>`;
        }

    }

    addGroup() {
        let groupInput = document.querySelector('.groupNameInput');
        let groupName = this.createGroupName();
        let groupsList = document.querySelector('.groups');
        let newGroup = { name: groupName, number: 0, tasks: [] };
        let newUntitledGroup = { name: 'New group', number: 0, tasks: [] };

        if (this.groups.length <= 0) {
            groupsList.innerHTML = ''
        }
        groupsList.classList.remove('centeredContent')
        if (groupName.length > 0) {
            this.groups.push(newGroup);
            newGroup.number += this.groups.length - 1;
            groupsList.insertAdjacentHTML('beforeend', newGroupTemplate.render(newGroup.name, newGroup.number));
            let groupBlock = document.querySelector(`.js-group${newGroup.number}`);
            groupBlock.addEventListener('click', (e) => {
                let saveBtn = document.querySelector(`.js-saveGroupBtn${newGroup.number}`);
                let editBtn = document.querySelector(`.js-editGroupBtn${newGroup.number}`);
                let nameEditor = document.querySelector(`.js-groupEditor${newGroup.number}`);
                if (document.querySelector(`.js-group${newGroup.number}`) && e.target != saveBtn && e.target != editBtn.firstChild && e.target != editBtn && e.target != nameEditor) {
                    this.renderTasksInGroup(newGroup)
                    this.switchCurrentGroup(groupBlock)
                }
            });
            document.querySelector(`.js-editGroupBtn${newGroup.number}`).addEventListener('click', () => this.editGroupName(newGroup));
            document.querySelector(`.js-deleteGroupBtn${newGroup.number}`).addEventListener('click', () => this.deleteGroup(newGroup));
        } else {
            this.groups.push(newUntitledGroup);
            newUntitledGroup.number += this.groups.length - 1;
            groupsList.insertAdjacentHTML('beforeend', newGroupTemplate.render(newUntitledGroup.name, newUntitledGroup.number));
            let groupBlock = document.querySelector(`.js-group${newUntitledGroup.number}`);
            groupBlock.addEventListener('click', (e) => {
                let saveBtn = document.querySelector(`.js-saveGroupBtn${newUntitledGroup.number}`);
                let editBtn = document.querySelector(`.js-editGroupBtn${newUntitledGroup.number}`);
                let nameEditor = document.querySelector(`.js-groupEditor${newUntitledGroup.number}`);
                if (document.querySelector(`.js-group${newUntitledGroup.number}`) && e.target != saveBtn && e.target != editBtn.firstChild && e.target != editBtn && e.target != nameEditor) {
                    this.renderTasksInGroup(newUntitledGroup);
                    this.switchCurrentGroup(groupBlock);
                }
            });
            document.querySelector(`.js-editGroupBtn${newUntitledGroup.number}`).addEventListener('click', () => this.editGroupName(newUntitledGroup));
            document.querySelector(`.js-deleteGroupBtn${newUntitledGroup.number}`).addEventListener('click', () => setTimeout(this.deleteGroup(newUntitledGroup), 50));
        }
        groupInput.value = '';
    }

    deleteGroup(group) {
        let groupsArray = this.groups;
        let groupTemplate = document.querySelector(`.js-group${group.number}`);
        let groupTasksActions = document.querySelector('.groupTasksActions');
        let groupTasksContainer = document.querySelector('.groupTasksContainer');
        let groupTasksList = document.querySelector(`.js-tasksOfGroup${group.number}`);
        let renderedGroupsList = document.querySelector('.groups');

        group.tasks.forEach(task => {
            let taskInAllTasksArray = taskList.tasks.find(groupedTask => groupedTask.id == task.id);
            taskInAllTasksArray.group = 'No group';
        })

        groupsArray.splice(groupsArray.indexOf(group, 1));
        groupTemplate.remove();
        if (this.groups.length <= 0) {
            renderedGroupsList.classList.add('centeredContent')
            renderedGroupsList.innerHTML = `
            <div class="noGroups">
                You have not created any groups yet, to create a group, click on the "+" button
            </div>
            `
        }
        if (groupTasksList) {
            groupTasksActions.innerHTML = '';
            groupTasksContainer.classList.add('centeredContent');
            groupTasksContainer.innerHTML = '<p>Choose group or create new one</p>';
        }
    }

    renderTaskWhenAdded(task, group) {
        let groupTasksContainer = document.querySelector('.groupTasksContainer');
        if (groupTasksContainer) {
            groupTasksContainer.innerHTML = `<div class="groupTasksList js-tasksOfGroup${group.number}"></div>`
            let groupTasksList = document.querySelector(`.js-tasksOfGroup${group.number}`);
            groupTasksList.insertAdjacentHTML('beforeend', newTask.renderGrouped(task.title, task.id, task.description));
            document.querySelector(`.js-delete-btn${task.id}`).addEventListener('click', () => taskList.removeTask(task));
            document.querySelector(`.js-edit-btn${task.id}`).addEventListener('click', () => taskList.oneTimeOneEdit(task));
            document.querySelector(`.js-saveTask-btn${task.id}`).addEventListener('click', () => taskList.saveEditedTask(task));
            document.querySelector(`.js-rfg-btn${task.id}`).addEventListener('click', () => this.removeTaskFromGroup(task, group));
            taskList.showOrHideToolBar(task);
            taskAdd.attachTaskPopup(task);
            taskList.saveEditedTask(task);
        }
    }

    removeTaskFromGroup(task, group) {
        let groupTasksContainer = document.querySelector('.groupTasksContainer');
        let taskTemplate = document.querySelector(`.js-taskId${task.id}`);
        let tasksInGroup = group.tasks;
        let taskInAllTasksArray = taskList.tasks.find(groupedTask => groupedTask.id == task.id);
        tasksInGroup.splice(tasksInGroup.indexOf(task), 1);
        taskTemplate.remove()

        taskInAllTasksArray.lastGroupNumber = 'none'
        taskInAllTasksArray.group = 'No group'

        if (tasksInGroup.length <= 0) {
            groupTasksContainer.classList.add('centeredContent');
            groupTasksContainer.innerHTML = `
            <div class="noGroupTasks">
                <img src="./img/notepad-empty.jpg" alt="noTasks">
                <p>Group <span>${group.name}</span> is empty</p>
            </div>
            `
        }
    }

    searchTaskInGroupLive() {
        let searchTaskInput = document.querySelector('.searchTaskInGroup input');
        searchTaskInput.addEventListener('input', () => {
            let searchedTasks = document.querySelectorAll('.task');
            let val = searchTaskInput.value.trim();
            if (val != '') {
                searchedTasks.forEach(element => {
                    if (element.querySelector('.taskTitleText').innerText.search(val) == -1) {
                        element.classList.add('disabled');
                    } else {
                        element.classList.remove('disabled');
                    }
                })
            } else {
                searchedTasks.forEach(element => {
                    element.classList.remove('disabled');
                })
            }
        })
    }

    switchCurrentGroup(element) {
        let currentGroup = document.querySelector('.currentGroup');
        if (currentGroup) {
            currentGroup.classList.remove('currentGroup');
            element.classList.add('currentGroup');
        } else {
            element.classList.add('currentGroup');
        }
    }

    init() {
        document.querySelector('#groups').addEventListener('click', () => this.render());
        document.querySelector('#alltasks').addEventListener('click', () => taskList.renderList());
    }
}

class ChoosingTaskMenu {
    constructor() {
        this.choosedTasks = [];
    }

    renderAddingTask(task) {
        let taskTemplate;
        if (task.lastGroupNumber != 'none') {
            taskTemplate = `
       <div class="groupAddingTask">
            <div class="groupAddingTask__info js-groupAddingTask${task.id}">
                <p class="groupAddingTaskTitle">${task.title}</p>
                <p class="groupAddingTaskDescr">${task.description}</p>
            </div>
            <div class="groupAddingTask__settings">
                <div class="isInGroup js-taskGroupName${task.id}">
                    <p class="groupedAlert">Grouped <span><i class="fa-sharp fa-solid fa-circle-info"></i></span></p>
                </div>
                <label class="addTaskCheckbox_container">
                    <input type="checkbox" class="addTaskCheckbox js-taskCheckbox${task.id}">
                    <div class="addTaskCheckbox__itSelf"></div>
                </label>
            </div>
       </div>
       <div class="groupPrompt js-groupPrompt${task.id} disabled">This task is in group named <b>${task.group}</b></div>
       `
        } else {
            taskTemplate = `
       <div class="groupAddingTask">
            <div class="groupAddingTask__info js-groupAddingTask${task.id}">
                    <p class="groupAddingTaskTitle">${task.title}</p>
                    <p class="groupAddingTaskDescr">${task.description}</p>
            </div>
            <div class="groupAddingTask__settings" style="justify-content: center; align-items: center;">
                <label class="addTaskCheckbox_container">
                    <input type="checkbox" class="addTaskCheckbox js-taskCheckbox${task.id}">
                    <div class="addTaskCheckbox__itSelf"></div>
                </label>
            </div>
       </div>
       `
        }
        return taskTemplate;
    }

    openChoosingTaskMenu(group) {
        this.choosedTasks = [];
        let addingTasksMenu = document.querySelector('.addingTasksMenu');
        addingTasksMenu.classList.remove('disabled')
        let addingTasksList = document.querySelector('.tasksMenuBody');
        if (taskList.tasks.length > 0) {
            let emptyAddingTasksList = '';
            taskList.tasks.forEach(task => {
                emptyAddingTasksList += this.renderAddingTask(task);
                return emptyAddingTasksList;
            })
            addingTasksList.innerHTML = emptyAddingTasksList;
            taskList.tasks.forEach(task => {
                document.querySelector(`.js-groupAddingTask${task.id}`).addEventListener('click', () => modalGroups.addTaskToGroup(task, group));

                let taskCheckbox = document.querySelector(`.js-taskCheckbox${task.id}`);
                taskCheckbox.addEventListener('click', () => this.init(task));

                let groupName = document.querySelector(`.js-taskGroupName${task.id} span`);
                if (groupName) {
                    groupName.addEventListener('mouseenter', (e) => {
                        if (e.target == groupName) {
                            this.showGroupPrompt(task);
                        }
                    });
                    groupName.addEventListener('mouseleave', (e) => {
                        if (e.target == groupName) {
                            this.hideGroupPrompt(task);
                        }
                    })
                }
            })

        } else {
            addingTasksList.innerHTML = `<p>Task list is empty, you need create task, to add it to group</p>`
        }
    }

    activateOrDeactivateCheckbox(task) {
        let groupCheckbox = document.querySelector(`.js-taskCheckbox${task.id}`);
        if (!groupCheckbox.checked) {
            groupCheckbox.checked = true;
        } else {
            groupCheckbox.checked = false;
        }
    }

    activateAddChoosedTasksButton() {
        let addChoosedTasksBtn = document.querySelector(`.addChoosedTasks`);
        if (this.choosedTasks.length > 0) {
            addChoosedTasksBtn.classList.remove('disabled');
        } else {
            addChoosedTasksBtn.classList.add('disabled');
        }
    }

    chooseAddingTask(task) {
        const existTask = this.choosedTasks.find(choosedTask => choosedTask.id == task.id);
        if (!existTask) {
            this.choosedTasks.push(task);
        } else {
            this.choosedTasks.splice(this.choosedTasks.indexOf(task), 1);
        }
    }

    addChoosedTasksToGroup(group) {
        this.choosedTasks.forEach(task => {
            modalGroups.addTaskToGroup(task, group)
        })
        this.choosedTasks = [];
        taskGroups.renderTasksInGroup(group)
    }

    showGroupPrompt(task) {
        let prompt = document.querySelector(`.js-groupPrompt${task.id}`);
        prompt.classList.remove('disabled');
    }

    hideGroupPrompt(task) {
        let prompt = document.querySelector(`.js-groupPrompt${task.id}`);
        prompt.classList.add('disabled');
    }

    closeChoosingTaskMenu() {
        this.choosedTasks = [];
        let addingTasksMenu = document.querySelector('.addingTasksMenu');
        addingTasksMenu.classList.add('disabled')
        let addChoosedTasksBtn = document.querySelector('.addChoosedTasks');
        if (!addChoosedTasksBtn.classList.contains('disabled')) {
            addChoosedTasksBtn.classList.add('disabled')
        }
    }

    init(task) {
        this.chooseAddingTask(task)
        this.activateAddChoosedTasksButton()
    }
}

class Filters {
    constructor() {
        this.filtersProperties = {
            byTitle: { isActive: false, direction: 'none' },
            byDateAdded: { isActive: false, direction: 'none' },
            byDateComplete: { isActive: false, direction: 'none' }
        }
    }

    filterByTitle(direction) {
        let sortedTasks = taskList.tasks.slice();
        sortedTasks.sort(function sortfunction(a, b) {
            let titleA = a.title.toLowerCase();
            let titleB = b.title.toLowerCase();
            if (direction == 'default') {
                if (titleA < titleB) {
                    return -1;
                }
                if (titleA > titleB) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (titleA < titleB) {
                    return 1;
                }
                if (titleA > titleB) {
                    return -1;
                } else {
                    return 0;
                }
            }

        })

        filters.filtersProperties.byTitle.direction = direction;
        filters.filtersProperties.byTitle.isActive = true;
        taskList.renderTasksInList(sortedTasks);
    }

    filterByCompleteDate(direction) {
        let sortedTasks = taskList.tasks.slice();
        sortedTasks.sort(function sortfunction(a, b) {
            let dateA = new Date(a.completeDate.year, a.completeDate.month, a.completeDate.day);
            let dateB = new Date(b.completeDate.year, b.completeDate.month, b.completeDate.day);
            if (direction == 'default') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }

        })

        filters.filtersProperties.byDateComplete.direction = direction;
        filters.filtersProperties.byDateComplete.isActive = true;
        taskList.renderTasksInList(sortedTasks);
    }

    filterByDateAdded(direction) {
        let sortedTasks = taskList.tasks.slice();
        sortedTasks.sort(function sortfunction(a, b) {
            let dateA = new Date(a.createDate.year, a.createDate.month, a.createDate.day);
            let dateB = new Date(b.createDate.year, b.createDate.month, b.createDate.day);
            if (direction == 'default') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        })

        filters.filtersProperties.byDateAdded.direction = direction;
        filters.filtersProperties.byDateAdded.isActive = true;
        taskList.renderTasksInList(sortedTasks);
    }

    disableFilters() {
        if (taskList.tasks.length > 1) {
            let caretElems = document.querySelectorAll('.ascendDescend');
            caretElems.forEach(elem => {
                elem.innerHTML = '<i class="fa-solid fa-sort"></i>'
            })

            for (let property in this.filtersProperties) {
                this.filtersProperties[property].isActive = false;
                this.filtersProperties[property].direction = 'none';
            }

            taskList.renderTasksInList(taskList.tasks);
            this.isFilterActiveHandler()
        }

    }

    isFilterActiveHandler() {
        let clearFiltersBtn = document.querySelector('.clearFiltersBtn');
        if (this.isFilterActive = false) {
            clearFiltersBtn.classList.add('disabled')
        } else {
            clearFiltersBtn.addEventListener('click', () => this.disableFilters());
            clearFiltersBtn.classList.remove('disabled');
        }
    }

    filterDirectionHandler(isActive, direction, func, elem) {
        let caretElem = document.querySelector(elem)
        if (taskList.tasks.length > 1) {
            this.disableFilters()
            if (direction != 'none') {
                if (isActive = true) {
                    if (direction == 'default') {
                        direction = 'reverse';
                        caretElem.innerHTML = '<i class="fa-solid fa-caret-up"></i>'
                        func(direction);
                    } else {
                        direction = 'default';
                        caretElem.innerHTML = '<i class="fa-solid fa-caret-down"></i>'
                        func(direction);
                    }
                }
            } else {
                caretElem.innerHTML = '<i class="fa-solid fa-caret-down"></i>'
                func('default');
            }
        }

    }

    init() {
        document.querySelector('.js-titleFilter').addEventListener('click', () => this.filterDirectionHandler(this.filtersProperties.byTitle.isActive, this.filtersProperties.byTitle.direction, this.filterByTitle, '.js-sortTitle'));
        document.querySelector('.js-dateAddedFilter').addEventListener('click', () => this.filterDirectionHandler(this.filtersProperties.byDateAdded.isActive, this.filtersProperties.byDateAdded.direction, this.filterByDateAdded, '.js-sortDateAdded'));
        document.querySelector('.js-dateCompleteFilter').addEventListener('click', () => this.filterDirectionHandler(this.filtersProperties.byDateComplete.isActive, this.filtersProperties.byDateComplete.direction, this.filterByCompleteDate, '.js-sortDateComplete'));

        this.isFilterActiveHandler()
    }
}

class NavBar {
    constructor() { }

    switchActiveTab() {
        let allTasks = document.querySelector('#alltasks');
        let groups = document.querySelector('#groups');
        allTasks.addEventListener('click', () => {
            groups.classList.remove('tabButtonActive');
            allTasks.classList.add('tabButtonActive')
        })
        groups.addEventListener('click', () => {
            allTasks.classList.remove('tabButtonActive');
            groups.classList.add('tabButtonActive');
        })
    }
}

const taskAdd = new TaskAdder;
const newTask = new Task;
const taskList = new TaskList;
const newGroupTemplate = new Group;
const taskGroups = new TaskGroups;
const choosingTaskMenu = new ChoosingTaskMenu;
const navBar = new NavBar;
const filters = new Filters;

taskAdd.init()
taskList.init()
taskGroups.init()
navBar.switchActiveTab()
checkToday()