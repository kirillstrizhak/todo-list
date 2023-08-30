class Popup {
    constructor(popupHeading, popupText, popupedTask, popupGroups, calendar, subtasks) {
        this.popupHeading = popupHeading;
        this.popupText = popupText;
        this.popupedTask = popupedTask;
        this.popupGroups = popupGroups;
        this.calendar = calendar;
        this.subtasks = subtasks;
    };

    show(popupType, popupId) {
        let popup = document.querySelector(`.modal${popupId}`);
        if (popup) {
            popup.remove();
            this.render(popupType, popupId, this.popupedTask)
        } else {
            this.render(popupType, popupId, this.popupedTask)
        }
    }

    hide(task) {
        let popup = document.querySelector(`.popupBody`);
        if (popup) {
            popup.remove();
        }
        if (task) {
            taskAdd.attachTaskPopup(task);
        }
    }

    hideOnClick(task) {
        let popupBackground = document.querySelector(`.popupBackground`);
        window.addEventListener('click', function (e) {
            if (e.target == popupBackground) {
                modalTask.hide(task)
            }
        })
    }

    render(popupType, popupId, task) {
        document.body.insertAdjacentHTML('afterbegin', `
        <div class="popupBody modal${popupId}">
            <div class="popupBackground"></div>
            <div class="popupContent popupSizePos ${popupType}">
                <div class="popupHeader"></div>
                <div class="popupMain">
                    <div class="popupEditor"></div>
                    <div class="popupTaskSettings"></div>
                </div>
            </div>
        </div>
        `);
        this.renderSections(popupId, task);
    };

    renderSections(popupId, task) {
        this.renderPopupHeader(popupId);
        this.renderPopupEditor(task);
        this.renderPopupSettings(task)
        this.attachEventsAndInits(task, popupId);
    }

    renderPopupHeader(popupId) {
        let header = document.querySelector('.popupHeader');
        header.innerHTML = `
        <div class="popupToolBar">
            <div class="modal-delete"><i class="fa-solid fa-trash"></i></div>
            <div id="close-btn-${popupId}" class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
        </div>
        `
    }

    renderPopupEditor(task) {
        let editorSection = document.querySelector('.popupEditor');
        editorSection.innerHTML = `
        <div class="popupText">
            <div class="popupTaskInf js-taskInf${task.id}">
                <div class="popupTaskTitle js-popupTaskTitle${task.id}"><p>${task.title}</p></div>
                <div class="popupTaskDescr js-popupTaskDescription${task.id}"><p>${task.description}</p></div>   
            </div>
            <div class="taskBtn button savePopup-btn js-savePopup" style="display: none;">Save</div>
        </div>
        <div class="subtasksCount"><div class="subtaskCountLine"></div><p><span class="js-subtasksCounter">${task.subtasks.length}</span> subtasks</p><div class="subtaskCountLine"></div></div>
        <div class="subtasksContainer">
            <div class="popupAddSubtask">
                <div class="addSubTask button"><span><i class="fa-solid fa-plus"></i> Add subtask</span></div>
            </div>    
            <div class="taskSubtasks"></div>
        </div>
        `
        this.renderSubtasksCounter(task)
    }

    renderPopupSettings(task) {
        let settingsSection = document.querySelector('.popupTaskSettings');
        settingsSection.innerHTML = `
        <div class="taskSetting taskDate">
            <span>Created</span>
            <p>${this.checkIsToday(task)}</p>
        </div>
        <div class="taskSetting completeDate">
            <span>Complete date</span>
            <div class="calendarDate settingInnerContent">
            <p class="completeDateField">${task.completeDate.day}.${task.completeDate.month}.${task.completeDate.year}</p>
            <button class="addOrChangeSettingBtn js-calendarOpener"><i class="fa-solid fa-calendar-days"></i></button></div>
        </div>
        <div class="calendar disabled">
            <div class="calendarContainer">
                <div class="calendarHeader"><div class="closeCalendarBtn"><i class="fa-solid fa-xmark"></i></div></div>
                <div class="calendarToolbar">
                    <div class="calendarSlider js-year">
                        <button class="button calendarSliderBtn js-prevYear"><i class="fa-solid fa-chevron-left"></i></button>
                        <div class="yearField"></div>
                        <button class="button calendarSliderBtn js-nextYear"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                    <div class="calendarSlider js-month">
                        <button class="button calendarSliderBtn js-prevMonth"><i class="fa-solid fa-chevron-left"></i></button>
                        <div class="monthField"></div>
                        <button class="button calendarSliderBtn js-nextMonth"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
                <div id="calendarBody" class="calendarBody"></div>
            </div>
        </div>
        <div class="taskSetting group">
            <span>Group</span>
            <div class="taskGroupSelect openGroupDropdown settingInnerContent">
            <div class="groupsSelectmenu">${task.group}</div>
            <button class="addOrChangeSettingBtn groupSelectBtn"><i class="fa-solid fa-caret-down"></i></button>
            </div>
        </div>
        <div class="completeButtonContainer">
            <div class="button completeButton js-completeButton${task.id}">Complete ✔</div>
        </div>
        `
    }

    editPopupTask(task, popupInfoCalss, titleClass, descrClass, saveButtonClass) {
        let popupInfo = document.querySelector(`.js-${popupInfoCalss}${task.id}`);
        let title = document.querySelector(`.js-${titleClass}${task.id}`);
        let description = document.querySelector(`.js-${descrClass}${task.id}`);

        popupInfo.style.border = '1px solid #dedede'
        title.innerHTML = `
        <textarea class="popupTitleEditor inactiveText" type="text" maxlength="200" placeholder="Task title">${task.title}</textarea>
        `
        description.innerHTML = `
        <textarea class="popupDescrEditor" placeholder="Description" maxlength="3000">${task.description}</textarea>
        `

        let popupTitleEditor = document.querySelector('.popupTitleEditor');
        let popupDescriptionEditor = document.querySelector('.popupDescrEditor');

        popupTitleEditor.style.height = (popupTitleEditor.scrollHeight) + "px";
        popupTitleEditor.addEventListener('input', () => {
            popupTitleEditor.style.height = "1px";
            popupTitleEditor.style.height = (popupTitleEditor.scrollHeight) + "px";
            if (popupTitleEditor.value <= 0) {
                task.title = 'Title'
            } else {
                task.title = popupTitleEditor.value;
            }
        })

        popupDescriptionEditor.style.height = (popupDescriptionEditor.scrollHeight) + "px";
        popupDescriptionEditor.addEventListener('input', (e) => {
            popupDescriptionEditor.style.height = "1px";
            popupDescriptionEditor.style.height = (popupDescriptionEditor.scrollHeight) + "px";
            if (popupDescriptionEditor.value <= 0) {
                task.description = ''
            } else {
                task.description = popupDescriptionEditor.value;
            }
        })
        document.querySelector(`.${saveButtonClass}`).style.display = 'flex';
        document.querySelector(`.${saveButtonClass}`).addEventListener('click', () => this.saveEditedPopupTask(task, popupInfoCalss, titleClass, descrClass, saveButtonClass));
    }

    saveEditedPopupTask(task, popupInfoCalss, titleClass, descrClass, saveButtonClass) {
        let popupInfo = document.querySelector(`.js-${popupInfoCalss}${task.id}`);
        popupInfo.style.border = '1px solid transparent'
        document.querySelector(`.${saveButtonClass}`).style.display = 'none';
        document.querySelector(`.js-${titleClass}${task.id}`).innerHTML = `<p>${task.title}</p>`

        if (popupInfo != document.querySelector(`.js-popupSubTaskTitle${task.id}`)) {
            document.querySelector(`.js-title${task.id}`).innerHTML = `<p class="taskTitleText titleText${task.id}">${task.title}</p>`
        }

        if (task.description.length <= 0) {
            document.querySelector(`.js-${descrClass}${task.id}`).innerHTML = `<p class="inactiveText">Description</p>`
        } else {
            document.querySelector(`.js-${descrClass}${task.id}`).innerHTML = `<p>${task.description}</p>`
            document.querySelector(`.js-body${task.id}`).innerHTML = `<p class="taskDescrText inactiveText">${task.description}</p>`
        }
        taskList.renderList(taskList.tasks)
    }

    renderSubtasksCounter(task) {
        if (task.subtasks.length > 0 && task.subtasks.length != 1) {
            document.querySelector('.subtasksCount p').innerHTML = `${task.subtasks.length} subtasks`
        } else if (task.subtasks.length == 1) {
            document.querySelector('.subtasksCount p').innerHTML = `${task.subtasks.length} subtask`
        } else {
            document.querySelector('.subtasksCount p').innerHTML = `No subtasks`
        }
    }

    removePopupAndTask(task) {
        let popup = document.querySelector(`.modal${task.id}`);
        popup.remove();
        taskList.removeTask(task);
    }

    calendarDraggable() {
        let calendar = document.querySelector('.calendarContainer');
        let calendarDragField = document.querySelector('.calendarHeader');

        calendarDragField.addEventListener('mosedown', () => {
            calendar.style.position = 'absolute';
        })
    }

    attachEventsAndInits(task, popupId) {
        if (task.description.length <= 0) {
            document.querySelector(`.popupTaskDescr`).innerHTML = `<p class="inactiveText">Description</p>`;
        } //Style changing to inactive if description is empty
        document.querySelector('.modal-delete').addEventListener('click', () => this.removePopupAndTask(task));
        document.querySelector(`#close-btn-${popupId}`).addEventListener('click', () => this.hide(popupId));
        document.querySelector(`.js-taskInf${task.id}`).addEventListener('click', () => {
            let editor = document.querySelector('.popupTitleEditor');
            if (!editor) {
                this.editPopupTask(task, 'taskInf', 'popupTaskTitle', 'popupTaskDescription', 'js-savePopup')
            }
        }); //Edit on click

        let taskCompleteDate = task.completeDate;
        document.querySelector('.calendarDate').addEventListener('click', () => modalCalendar.init(task, document.querySelector('#calendarBody'), taskCompleteDate.year, taskCompleteDate.month))
        document.querySelector('.completeDate').addEventListener('click', () => modalCalendar.show());
        document.addEventListener('click', () => { })

        document.querySelector(`.js-completeButton${task.id}`).addEventListener('click', () => this.completeTaskModal(task))

        modalSubtasks.renderSubtasks(task);
        modalSubtasks.init(task)
        this.hideOnClick(task, popupId);
        modalGroups.init(task);
    }

    completeTaskModal(task) {
        this.hide(task)
        taskList.completeTask(task);
    }

    checkIsToday(task) {
        let date = task.createDate;
        let now = checkToday();
        if (now.day == date.day && now.month == date.month && now.year == date.year) {
            date = 'Today'
        } else {
            date = `${task.createDate.day}.${task.createDate.month}.${task.createDate.year}`
        }
        return date;
    }
}

class PopupGroups {
    constructor() { }

    renderGroup(group) {
        let groupTemplate = `
        <div class="menuGroup group${group.number}">
            <p>${group.name}</p>
        </div>
        `;
        return groupTemplate;
    }

    renderTemplate(task) {
        let menuBlock = document.querySelector('.groupsSelectmenu');
        menuBlock.innerHTML = `
        ${task.group}
        <div class="groupsMenuDropdown">
            <input class="searchPopupGroup" type="text" placeholder="Enter group name...">
            <div class="groupsMenuList"></div>
        </div>`
    }

    render(task) {
        document.querySelector('.groupSelectBtn').style.transform = 'rotate(180deg)';
        this.renderTemplate(task);
        let menuDropdown = document.querySelector('.groupsMenuList');
        let emptyMenu = '';
        taskGroups.groups.forEach(group => {
            emptyMenu += this.renderGroup(group);
            return emptyMenu;
        })
        menuDropdown.innerHTML = emptyMenu;
        this.searchGroupInit();
        this.addTaskToGroupListeners(task);
    }

    searchGroupInit() {
        let input = document.querySelector('.searchPopupGroup');
        input.addEventListener('input', () => {
            let value = input.value.trim();
            let filteredGroups = document.querySelectorAll('.menuGroup');
            if (value != '') {
                filteredGroups.forEach(group => {
                    if (group.innerText.search(value) == -1) {
                        group.classList.add('disabled');
                    } else {
                        group.classList.remove('disabled');
                    }
                })
            } else {
                filteredGroups.forEach(group => {
                    group.classList.remove('disabled');
                })
            }
        })
    }

    searchGroupClickHandler() {
        let searchGroup = document.querySelector('.searchPopupGroup');
        if (searchGroup) {
            searchGroup.addEventListener('click', (e) => {
                if (e.target !== searchGroup) {
                    this.render()
                }
            })
        }
    }

    existMenuHandler(e, task) {
        this.searchGroupClickHandler()
        let menuDropdown = document.querySelector('.groupsMenuList');
        let searchGroup = document.querySelector('.searchPopupGroup');
        if (!menuDropdown) {
            this.render(task);
        } else if (menuDropdown && e.target !== searchGroup) {
            this.searchGroupClickHandler()
            this.hide(task);
        }
    }

    addTaskToGroup(task, group) {
        const existTask = group.tasks.find(groupedTask => groupedTask.id == task.id);
        if (!existTask && task.lastGroupNumber != 'none') {
            let tasksInNewGroupArray = group.tasks;
            let tasksInGroupArray = taskGroups.groups[task.lastGroupNumber].tasks;
            task.lastGroupNumber = group.number;
            tasksInGroupArray.splice(tasksInGroupArray.indexOf(task), 1);
            tasksInNewGroupArray.push(task);
            task.group = group.name;
        } else if (!existTask) {
            let tasksInNewGroupArray = group.tasks;
            task.lastGroupNumber = group.number;
            tasksInNewGroupArray.push(task);
            task.group = group.name;
        }

        let groupTasksContainer = document.querySelector('.groupTasksContainer'); //Function for adding tasks from group menu (Look taskGroups functions)
        if (groupTasksContainer) {
            taskGroups.renderTasksInGroup(group)
        }
    }

    addTaskToGroupListeners(task) {
        taskGroups.groups.forEach(group => {
            let groupButton = document.querySelector(`.group${group.number}`);
            groupButton.addEventListener('click', () => this.addTaskToGroup(task, group));
            groupButton.addEventListener('click', () => {
                let groupsList = document.querySelector('.taskGroups')
                if (groupsList) {
                    taskGroups.render()
                }
            });
        })
    }

    init(task) {
        document.querySelector('.openGroupDropdown').addEventListener('click', (e) => this.existMenuHandler(e, task));

    }

    hide(task) {
        document.querySelector('.groupsSelectmenu').innerHTML = `${task.group}`;
        document.querySelector('.groupSelectBtn').style.transform = 'rotate(360deg)';
    }

}

class Calendar {
    constructor() { }

    show() {
        let parent = document.querySelector('.calendar');
        parent.classList.remove('disabled')
    }

    hide() {
        let parent = document.querySelector('.calendar');
        parent.classList.add('disabled');
    }

    renderTemplate() {
        return `
        <div class="calendarContainer">
            <div class="calendarToolbar">
                <div class="calendarSlider js-year">
                    <button class="prev js-prevYear">Prev</button>
                    <div class="yearField"></div>
                    <button class="next js-nextYear">Next</button>
                </div>
                <div class="calendarSlider js-month">
                    <button class="prev js-prevMonth">Prev</button>
                    <div class="monthField"></div>
                    <button class="next js-nextMonth">Next</button>
                </div>
            </div>
            <div id="calendarBody"></div>
        </div>
        `
    }

    monthConverter(monthNumber, elem) {
        switch (monthNumber) {
            case 1:
                elem.innerHTML = 'Январь';
                break;
            case 2:
                elem.innerHTML = 'Февраль';
                break;
            case 3:
                elem.innerHTML = 'Март';
                break;
            case 4:
                elem.innerHTML = 'Апрель';
                break;
            case 5:
                elem.innerHTML = 'Май';
                break;
            case 6:
                elem.innerHTML = 'Июнь';
                break;
            case 7:
                elem.innerHTML = 'Июль';
                break;
            case 8:
                elem.innerHTML = 'Август';
                break;
            case 9:
                elem.innerHTML = 'Сентябрь';
                break;
            case 10:
                elem.innerHTML = 'Октябрь';
                break;
            case 11:
                elem.innerHTML = 'Ноябрь';
                break;
            case 12:
                elem.innerHTML = 'Декабрь';
                break;
            default:

                break;
        }
    }

    createCalendar(task, elem, year, month) {
        let mon = month - 1;
        let date = new Date(year, mon);
        let monthField = document.querySelector('.monthField');
        let yearField = document.querySelector('.yearField');
        yearField.innerHTML = year;

        this.monthConverter(month, monthField);

        let table = `<table><tr><th>пн</th><th>вт</th><th>ср</th><th>чт</th><th>пт</th><th>сб</th><th>вс</th></tr><tr>`;
        for (let i = 0; i < this.getDay(date); i++) {
            table += '<td></td>';
        }
        while (date.getMonth() == mon) {
            table += `<td class="dateCell js-day${date.getDate() - 1}">${date.getDate()}</td>`;

            if (this.getDay(date) % 7 == 6) {
                table += '</tr><tr>';
            }

            date.setDate(date.getDate() + 1);
        }
        if (this.getDay(date) != 0) {
            for (let i = this.getDay(date); i < 7; i++) {
                table += '<td></td>';
            }
        }
        table += '</tr></table>';
        elem.innerHTML = table;

        let dates = document.querySelectorAll('.dateCell');
        dates.forEach(date => {
            if (date.innerText == date.getDay) {
                date.classList.add('activeCell')
            }
        })

        this.currentCompleteDateCell(task, year, month);

        let dayCells = document.querySelectorAll('.dateCell');
        for (let i = 0; i < dayCells.length; i++) {
            document.querySelector(`.js-day${i}`).addEventListener('click', () => this.chooseCompleteDate(task, i + 1, month, year))
        }

        document.querySelector('.closeCalendarBtn').addEventListener('click', () => this.hide())
    }

    currentCompleteDateCell(task, year, month) {
        let taskCompleteDate = task.completeDate;
        let day = document.querySelector(`.js-day${taskCompleteDate.day - 1}`);

        if (taskCompleteDate.year == year && taskCompleteDate.month == month) {
            day.classList.add('activeCell');
        }
    }

    getDay(date) {
        let day = date.getDay();
        if (day == 0) day = 7;
        return day - 1;
    }

    attachCalendarListeners(task, elem, year, month) {
        let prevMonthButton = document.querySelector('.js-prevMonth');
        let nextMonthButton = document.querySelector('.js-nextMonth');
        let prevYearButton = document.querySelector('.js-prevYear');
        let nextYearButton = document.querySelector('.js-nextYear');

        prevMonthButton.addEventListener('click', () => {
            if (month > 1) {
                this.createCalendar(task, elem, year, --month);
            } else {
                month = 12;
                this.createCalendar(task, elem, --year, month);
            }
        });
        nextMonthButton.addEventListener('click', () => {
            if (month < 12) {
                this.createCalendar(task, elem, year, ++month);
            } else {
                month = 1;
                this.createCalendar(task, elem, ++year, month);
            }
        });
        prevYearButton.addEventListener('click', () => this.createCalendar(task, elem, --year, month));
        nextYearButton.addEventListener('click', () => this.createCalendar(task, elem, ++year, month));
    }

    chooseCompleteDate(task, completeDay, completeMonth, completeYear) {
        let taskCompleteDate = task.completeDate;

        taskCompleteDate.day = completeDay;
        taskCompleteDate.month = completeMonth;
        taskCompleteDate.year = completeYear;

        let popupDateField = document.querySelector('.completeDateField');
        let activeCell = document.querySelector('.activeCell');
        let choosedCell = document.querySelector(`.js-day${completeDay - 1}`);

        if (activeCell) {
            activeCell.classList.remove('activeCell');
        }
        choosedCell.classList.add('activeCell');

        taskAdd.dateFormatHandler(task)
        popupDateField.innerHTML = `${task.completeDate.day}.${task.completeDate.month}.${task.completeDate.year}`
    }

    init(task, elem, year, month) {
        this.createCalendar(task, elem, year, month);
        this.attachCalendarListeners(task, elem, year, month);
    }
}

class Subtask {
    constructor() { }

    render(title, id, description) {
        return `<div class="task subtask taskListView js-subTaskId${id}">
        <div class="task__header">
            <div class="subtaskTitle js-subTitle${id}"><p class="taskTitleText js-subTitleText${id}">${title}</p></div>
            <div style="display: none;"class="task__header__toolBar js-subTaskToolBar${id}">
                <div class="completeTaskCircle js-completeSubCircle${id}"></div>
                <div class="tools">
                    <div class="taskBtn taskDelete button js-subDelete-btn${id} taskTool"><span><i class="fa-solid fa-trash"></i></span></div>
                    <div class="taskBtn taskedit button js-subEdit-btn${id} taskTool"><span><i class="fa-solid fa-pencil"></i></span></div>
                </div>    
            </div> 
        </div> 
        <div class="task__body js-subBody${id}">
            <p class="taskDescrText inactiveText">${description}</p>
        </div>
        <div class="task__footer js-subtaskFooter${id}">
            <div  style="display: none;" class="taskBtn button subSave taskSave js-subSave-btn${id}"><span>Save</i></span></div>
        </div>
        </div>
    </div>`
    }

    renderEditor(title, id, description) {
        return `<div class="task taskListView js-subTaskId${id}">
        <div class="task__header">
            <div class="taskTitle js-subTitle${id}">
            <textarea class="taskTitleEditor js-titleEditor${id} inactiveText" type="text" maxlength="200" placeholder="Subtask title">${title}</textarea></p></div>
            <div style="display: none;" class="task__header__toolBar js-taskToolBar${id}">
                <div class="taskBtn taskDelete button js-subDelete-btn${id}"><span><i class="fa-solid fa-trash"></i></span></div>
                <div class="taskBtn taskedit button js-subEdit-btn${id}"><span><i class="fa-solid fa-pencil"></i></span></div> 
            </div> 
        </div> 
        <div class="task__body js-subBody${id}">
        <textarea class="taskDescrEditor js-subDescr${id}" placeholder="Description" maxlength="3000">${description}</textarea>
        </div>
        <div class="task__footer js-taskFooter${id}">
        <div style="display: none;" class="taskBtn button subSave taskSave js-saveTask-btn${id}"><span>Save</i></span></div>
        <div class="taskConfirmAdding subConfirmAdding-btn${id} inactiveButton"><span>Add task</i></span></div>
        <div class="taskBtn taskCancelAdding button subCancelAdding-btn${id}"><span>Cancel</i></span></div>
        </div>
    </div>`
    }
}

class Subtasks {
    constructor() { }

    renderSubtasks(task) {
        let subtasksList = document.querySelector('.taskSubtasks');
        let emptySubtasksList = '';

        if (task.subtasks.length > 0) {
            task.subtasks.forEach(subtask => {
                emptySubtasksList += newSubtask.render(subtask.title, subtask.id, subtask.description);
                return emptySubtasksList;
            })

            subtasksList.innerHTML = emptySubtasksList;
            task.subtasks.forEach(subtask => {
                document.querySelector(`.js-subEdit-btn${subtask.id}`).addEventListener('click', () => this.oneTimeOneEdit(task, subtask));
                document.querySelector(`.js-subDelete-btn${subtask.id}`).addEventListener('click', () => this.removeSubTask(task, subtask));
                document.querySelector(`.js-subTitleText${subtask.id}`).addEventListener('click', () => {
                    if (subtask.isComplete == false) {
                        modalSubtaskPopup.renderSubtaskPopup(task, subtask);
                    }
                });
                document.querySelector(`.js-completeSubCircle${subtask.id}`).addEventListener('click', () => this.completeSubtask(task, subtask));
                this.showOrHideToolBar(subtask)
            })
        }
    }

    createSubtask(task) {
        let subTaskDate = taskAdd.createToday();
        let subTaskCompleteDate = taskAdd.createToday();
        let addedSubtask = { title: '', description: '', id: 1, parentTask: task.title, createDate: subTaskDate, completeDate: subTaskCompleteDate, isComplete: false };
        return addedSubtask;
    }

    createAddingForm(task, subtask) {
        let subtasksList = document.querySelector('.taskSubtasks');
        subtasksList.insertAdjacentHTML('beforeend', newSubtask.renderEditor(subtask.title, subtask.id - 1, subtask.description));
        taskList.resizeInputsWhenInput(subtask);

        let addBtn = document.querySelector(`.subConfirmAdding-btn${subtask.id - 1}`);
        let cancelBtn = document.querySelector(`.subCancelAdding-btn${subtask.id - 1}`);
        let titleEditor = document.querySelector('.taskTitleEditor');

        titleEditor.addEventListener('input', () => {
            subtask.title = titleEditor.value;
            if (titleEditor.value.length <= 0) {
                document.querySelector(`.subConfirmAdding-btn${subtask.id - 1}`).className = `taskConfirmAdding subConfirmAdding-btn${subtask.id - 1} inactiveButton`;
            } else {
                document.querySelector(`.subConfirmAdding-btn${subtask.id - 1}`).className = `taskBtn taskConfirmAdding button subConfirmAdding-btn${subtask.id - 1}`;
            }
        })

        addBtn.addEventListener('click', () => {
            if (titleEditor.value.length > 0) {
                this.renderNewSubtask(task, subtask)
            }
        });
        cancelBtn.addEventListener('click', () => {
            document.querySelector(`.js-subTaskId${subtask.id - 1}`).remove();
            this.oneTimeOneAdding()
        })
    }

    renderNewSubtask(task, subtask) {
        let subtasksArray = task.subtasks;
        let subtaskEditors = document.querySelector(`.js-subTaskId${subtask.id - 1}`);

        if (subtask.title.length != 0) {
            subtaskEditors.remove();
            subtasksArray.push(subtask);

            if (task.subtasks.indexOf(subtask) != 0) {
                let previewSubtaskIndex = task.subtasks.indexOf(subtask) - 1;
                subtask.id += task.subtasks[previewSubtaskIndex].id;
            }

            modalTask.renderSubtasksCounter(task)

            this.renderSubtasks(task)
            this.oneTimeOneAdding()
        }
    }

    editSubTask(task, subtask) {
        let taskBody = document.querySelector(`.js-subTaskId${subtask.id}`);
        let header = document.querySelector(`.js-subTitle${subtask.id}`);
        let body = document.querySelector(`.js-subBody${subtask.id}`);
        let toolBar = document.querySelector(`.js-subTaskToolBar${subtask.id}`);
        toolBar.style.display = 'none'
        taskBody.style.cssText = `border: 1px solid transparent; border: 1px solid #cdcdcd; border-radius: 10px; margin-bottom: 45px;`
        header.innerHTML = `
        <textarea class="taskTitleEditor js-subTitleEditor${subtask.id} inactiveText" type="text" maxlength="200" placeholder="Task title">${subtask.title}</textarea>`
        body.innerHTML = `
        <textarea class="taskDescrEditor js-subDescr${subtask.id}" placeholder="Description" maxlength="3000">${subtask.description}</textarea>
        `
        taskList.resizeInputsWhenInput(subtask)
        document.querySelector(`.js-subSave-btn${subtask.id}`).style.cssText = 'display: flex; top: 10px;';
        document.querySelector(`.js-subSave-btn${subtask.id}`).addEventListener('click', () => this.saveEditedSubTask(task, subtask));
        this.initEditors(subtask);
        this.oneTimeOneAdding()
    }

    removeSubTask(task, subtask) {
        let subtasks = task.subtasks;
        let subtaskTemplate = document.querySelector(`.js-subTaskId${subtask.id}`);
        subtasks.splice(subtasks.indexOf(subtask), 1);

        if (subtaskTemplate) {
            modalTask.renderSubtasksCounter(task);
            subtaskTemplate.remove()
        }
    }

    initEditors(subtask) {
        let titleEditor = document.querySelector('.taskTitleEditor');
        let descrEditor = document.querySelector('.taskDescrEditor');

        titleEditor.addEventListener('input', () => {
            subtask.title = titleEditor.value;
        })
        descrEditor.addEventListener('input', () => {
            subtask.description = descrEditor.value;
        })
    }

    saveEditedSubTask(task, subtask) {
        let taskBody = document.querySelector(`.js-subTaskId${subtask.id}`);
        taskBody.style.cssText = `border: 1px solid transparent; border-bottom: 1px solid #dedede; border-radius: 0;`
        document.querySelector(`.js-subSave-btn${subtask.id}`).style.display = 'none';
        document.querySelector(`.js-subTitle${subtask.id}`).innerHTML = `<p class="taskTitleText js-subTitleText${subtask.id}">${subtask.title}</p>`;
        document.querySelector(`.js-subBody${subtask.id}`).innerHTML = `<p class="taskDescrText inactiveText">${subtask.description}</p>`;
        document.querySelector(`.js-subTitleText${subtask.id}`).addEventListener('click', () => modalSubtaskPopup.renderSubtaskPopup(task, subtask));
        this.oneTimeOneAdding()
    }

    showOrHideToolBar(subtask) {
        let toolBar = document.querySelector(`.js-subTaskToolBar${subtask.id}`);
        let saveBtn = document.querySelector(`.js-subSave-btn${subtask.id}`);
        let taskBlock = document.querySelector(`.js-subTaskId${subtask.id}`);
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

    oneTimeOneAdding() {
        let addButton = document.querySelector('.addSubTask');
        let titleEditor = document.querySelector('.taskTitleEditor');
        if (titleEditor && addButton) {
            addButton.classList.add('hidden');
            addButton.style.transition = '0s'
        } else if (addButton) {
            addButton.classList.remove('hidden');
            addButton.style.transition = '0.2s'
        }
    }

    completeSubtask(task, subtask) {
        let subtaskText = document.querySelector(`.js-subTitleText${subtask.id}`);
        let subtaskPopup = document.querySelector(`.forkInfo`);
        if (subtaskText) {
            let subTaskCompleteCircle = document.querySelector(`.js-completeSubCircle${subtask.id}`);
            subTaskCompleteCircle.classList.add('hidden');
            subtaskText.style.textDecoration = 'line-through';
        }

        subtask.isComplete = true;
        if (!subtaskPopup) {
            setTimeout(() => this.removeSubTask(task, subtask), 800);
        } else {
            this.removeSubTask(task, subtask);
        }
    }

    oneTimeOneEdit(task, subtask) {
        let titleEditor = document.querySelector('.taskTitleEditor');
        if (!titleEditor) {
            this.editSubTask(task, subtask)
        } else {
            console.log('cant edit')
        }
    }

    init(task) {
        let addButton = document.querySelector('.addSubTask');
        addButton.addEventListener('click', () => this.createAddingForm(task, modalSubtasks.createSubtask(task)));
        addButton.addEventListener('click', () => this.oneTimeOneAdding());
    }
}

class SubtaskPopup {
    constructor() { }

    renderSubtaskPopup(task, subtask) {
        this.renderPopupEditorST(task, subtask)
        this.renderPopupSettingsST(subtask)
        this.init(task, subtask)
    }

    renderPopupEditorST(task, subtask) {
        let editorSection = document.querySelector('.popupEditor');
        editorSection.innerHTML = `
        <div class="forkInfo"><p class="js-toParentTask">${task.title}</p>|<div class="js-subtasksMenuOpener"><span><i class="fa-solid fa-code-fork"></i></span>${task.subtasks.length - 1} more</div></div>
        <div class="popupText subText">
            <div class="popupTaskInf js-subTaskInf${subtask.id}">
                <div class="popupTaskTitle js-popupSubTaskTitle${subtask.id}"><p>${subtask.title}</p></div>
                <div class="popupTaskDescr js-popupSubTaskDescription${subtask.id}"><p>${subtask.description}</p></div>   
            </div>
            <div class="taskBtn button savePopup-btn js-saveSubPopup" style="display: none;">Save</div>
        </div>     
        `
    }

    renderPopupSettingsST(subtask) {
        let settingsSection = document.querySelector('.popupTaskSettings');
        settingsSection.innerHTML = `
        <div class="taskSetting taskDate">
            <span>Created</span>
            <p>${modalTask.checkIsToday(subtask)}</p>
        </div>
        <div class="taskSetting completeDate">
            <span>Complete date</span>
            <div class="calendarDate settingInnerContent">
                <p class="completeDateField">${subtask.completeDate.day}.${subtask.completeDate.month}.${subtask.completeDate.year}</p>
            </div>
        </div>    
        <div class="completeButtonContainer">
            <div class="button completeButton">Complete ✔</div>
        </div>
        `
    }

    completePopupSubtask(task, subtask) {
        let subtaskTitle = document.querySelector(`.js-popupSubTaskTitle${subtask.id}`);
        subtaskTitle.style.textDecoration = 'line-through';

        modalTask.renderSections(task.id, task)
        modalSubtasks.completeSubtask(task, subtask);
    }

    init(task, subtask) {
        if (subtask.description.length <= 0) {
            document.querySelector(`.popupTaskDescr`).innerHTML = `<p class="inactiveText">Description</p>`;
        };
        document.querySelector(`.js-subTaskInf${subtask.id}`).addEventListener('click', () => {
            let editor = document.querySelector('.popupTitleEditor');
            if (!editor) {
                modalTask.editPopupTask(subtask, 'subTaskInf', 'popupSubTaskTitle', 'popupSubTaskDescription', 'js-saveSubPopup')
            }
        });
        document.querySelector('.js-toParentTask').addEventListener('click', () => modalTask.renderSections(task.id, task));
        document.querySelector('.completeButton').addEventListener('click', () => this.completePopupSubtask(task, subtask))
    }
}

const modalTask = new Popup;
const modalGroups = new PopupGroups;
const modalCalendar = new Calendar;
const newSubtask = new Subtask;
const modalSubtasks = new Subtasks;
const modalSubtaskPopup = new SubtaskPopup;