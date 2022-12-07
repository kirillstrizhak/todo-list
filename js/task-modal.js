class Popup {
    constructor(popupHeading, popupText, popupedTask, popupGroups, calendar) {
        this.popupHeading = popupHeading;
        this.popupText = popupText;
        this.popupedTask = popupedTask;
        this.popupGroups = popupGroups;
        this.calendar = calendar;
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

    hide(popupId) {
        let popup = document.querySelector(`.modal${popupId}`);
        popup.remove();
        taskAdd.attachTaskPopup(this.popupedTask)
    }

    hideOnClick(task) {
        let popup = document.querySelector(`.popupBody`);
        let popupBackground = document.querySelector(`.popupBackground`);
        window.addEventListener('click', function (e) {
            if (e.target == popupBackground) {
                modalTask.saveEditedPopupTask(task);
                popup.remove();
                taskAdd.attachTaskPopup(task);
            }
        })
    }

    render(popupType, popupId, task) {
        document.body.insertAdjacentHTML('afterbegin', `
        <div class="popupBody modal${popupId}">
            <div class="popupBackground">
            </div>
            <div class="popupContent popupSizePos ${popupType}">
                    <div class="popupHeader">
                        <div class="popupToolBar">
                            <div class="modal-delete">
                                <i class="fa-solid fa-trash"></i>
                            </div>
                            <div class="modal-edit">
                            <i class="fa-solid fa-pencil"></i>
                            </div>
                            <div id="modal-btn-${popupId}" class="modal-btn"><i class="fa-solid fa-xmark"></i></div>
                        </div>
                    </div>
                    <div class="popupMain">
                    <div class="popupEditor">
                        <div class="popupText">
                            <div class="popupTaskInf">
                                <div class="popupTaskTitle"><span>${this.popupHeading}</span></div>
                                <div class="popupTaskDescr"><span>${this.popupText}</span></div>   
                            </div>
                        </div>
                        <div class="popupSaveBar">
                            <div class="taskBtn button savePopup-btn hidden">Save</div>
                            <div class="addSubTask button">
                        <span><i class="fa-solid fa-plus"></i> Add subtask</span>
                        </div>
                        </div>    
                    </div>
                        <div class="popupTaskSettings">
                            <div class="taskSetting taskDate">
                                <span>Created</span>
                                <p>${this.checkIsToday(task)}</p>
                            </div>
                            <div class="taskSetting completeDate">
                                <span>Complete date</span>
                                <div class="calendarDate settingInnerContent">
                                <p class="completeDateField">${task.completeDate.day}/${task.completeDate.month}/${task.completeDate.year}</p>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `);
        if (this.popupedTask.description.length <= 0) {
            document.querySelector(`.popupTaskDescr`).innerHTML = `<span class="inactiveText">Description</span>`;
        }
        document.querySelector('.modal-delete').addEventListener('click', () => this.removePopupAndTask(this.popupedTask));
        document.querySelector('.modal-edit').addEventListener('click', () => this.editPopupTask(this.popupedTask));
        document.querySelector(`#modal-btn-${popupId}`).addEventListener('click', () => this.hide(popupId));
        document.querySelector('.popupTaskInf').addEventListener('click', () => {
            let editor = document.querySelector('.popupTitleEditor');
            if (!editor) {
                this.editPopupTask(this.popupedTask)
            }
        });

        let taskCompleteDate = this.popupedTask.completeDate;
        document.querySelector('.calendarDate').addEventListener('click', () => this.calendar.init(document.querySelector('#calendarBody'), taskCompleteDate.year, taskCompleteDate.month))
        document.querySelector('.completeDate').addEventListener('click', () => this.calendar.show());
        this.hideOnClick(this.popupedTask);
        this.popupGroups.init();

    };

    editPopupTask(task) {
        let popupInfo = document.querySelector('.popupTaskInf');
        let title = document.querySelector('.popupTaskTitle');
        let description = document.querySelector('.popupTaskDescr');
        popupInfo.style.border = '1px solid #dedede'
        title.innerHTML = `
        <textarea class="popupTitleEditor inactiveText" type="text" maxlength="200" placeholder="Task title">${task.title}</textarea>
        <div class="popupTitleCounter">
        </div>
        `
        description.innerHTML = `
        <textarea class="popupDescrEditor descr${task.id}" placeholder="Description" maxlength="3000">${task.description}</textarea>
        <div class="popupDescrCounter">
        </div>
        `

        let popupTitleEditor = document.querySelector('.popupTitleEditor');
        let popupDescriptionEditor = document.querySelector('.popupDescrEditor');

        popupTitleEditor.style.height = (popupTitleEditor.scrollHeight) + "px";
        popupTitleEditor.addEventListener('input', () => {
            let titleCounter = document.querySelector('.popupTitleCounter');
            titleCounter.innerHTML = `<span>Characters left: ${popupTitleEditor.value.length}/200</span>`;
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
            let descrCounter = document.querySelector('.popupDescrCounter');
            descrCounter.innerHTML = `<span>Characters left: ${popupDescriptionEditor.value.length}/3000</span>`;
            popupDescriptionEditor.style.height = "1px";
            popupDescriptionEditor.style.height = (popupDescriptionEditor.scrollHeight) + "px";
            if (popupDescriptionEditor.value <= 0) {
                task.description = ''
            } else {
                task.description = popupDescriptionEditor.value;
            }
        })
        document.querySelector(`.savePopup-btn`).classList.remove('hidden');
        document.querySelector(`.savePopup-btn`).addEventListener('click', () => this.saveEditedPopupTask(task));
    }

    saveEditedPopupTask(task) {
        let popupInfo = document.querySelector('.popupTaskInf');
        popupInfo.style.border = '1px solid transparent'
        document.querySelector(`.savePopup-btn`).classList.add('hidden');
        document.querySelector(`.popupTaskTitle`).innerHTML = `<span>${task.title}</span>`
        document.querySelector(`.js-title${task.id}`).innerHTML = `<p class="taskTitleText titleText${task.id}">${task.title}</p>`
        if (task.description.length <= 0) {
            document.querySelector(`.popupTaskDescr`).innerHTML = `<span class="inactiveText">Description</span>`
        } else {
            document.querySelector(`.popupTaskDescr`).innerHTML = `<span>${task.description}</span>`
            document.querySelector(`.js-body${task.id}`).innerHTML = `<p class="taskDescrText inactiveText">${task.description}</p>`
        }
    }

    removePopupAndTask(task) {
        let popup = document.querySelector(`.modal${task.id}`);
        popup.remove();
        taskList.removeTask(task);
    }

    //     confirmDeleting(task) {
    //         let taskBody = document.querySelector('.popupMain')
    //         taskBody.insertAdjacentHTML('beforeend', `
    //         <div class="deleteAlert">
    //         <div class="alertHeader">
    //             <h3>Deleting</h3>
    //         </div>
    //         <div class="alertContent">
    //             <div class="alertMain">
    //                 <p>Are you sure that you want delete this task?</p>
    //             </div>
    //             <div class="alertButtons">
    //                 <div class="alert-btn button confirm">Delete</div>
    //                 <div class="alert-btn button cancel">Cancel</div>
    //             </div>
    //         </div>    
    //     </div>
    // </div>`);

    //         document.querySelector('.confirm').addEventListener('click', () => this.removePopupAndTask(task));
    //         document.querySelector('.cancel').addEventListener('click', () => {
    //             let alert = document.querySelector('.deleteAlert');
    //             alert.remove()
    //         });
    //     }

    checkIsToday(task) {
        let date = task.createDate;
        let now = checkToday();
        if (now.day == date.day && now.month == date.month && now.year == date.year) {
            date = 'Today'
        } else {
            date = `${task.createDate.day}/${task.createDate.month}/${task.createDate.year}`
        }
        return date;
    }
}

class PopupGroups {
    constructor(groupedTask) {
        this.groupedTask = groupedTask;
    }

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

    render() {
        document.querySelector('.groupSelectBtn').style.transform = 'rotate(180deg)';
        this.renderTemplate(this.groupedTask);
        let menuDropdown = document.querySelector('.groupsMenuList');
        let emptyMenu = '';
        taskGroups.groups.forEach(group => {
            emptyMenu += this.renderGroup(group);
            return emptyMenu;
        })
        menuDropdown.innerHTML = emptyMenu;
        this.searchGroupInit();
        this.addTaskToGroupListeners(this.groupedTask);
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

    existMenuHandler(e) {
        this.searchGroupClickHandler()
        let menuDropdown = document.querySelector('.groupsMenuList');
        let searchGroup = document.querySelector('.searchPopupGroup');
        if (!menuDropdown) {
            this.render();
        } else if (menuDropdown && e.target !== searchGroup) {
            this.searchGroupClickHandler()
            this.hide(this.groupedTask);
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

    init() {
        document.querySelector('.openGroupDropdown').addEventListener('click', (e) => this.existMenuHandler(e));

    }

    hide(task) {
        document.querySelector('.groupsSelectmenu').innerHTML = `${task.group}`;
        document.querySelector('.groupSelectBtn').style.transform = 'rotate(360deg)';
    }

}

class Calendar {
    constructor(popupedTask) {
        this.popupedTask = popupedTask;
    }

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

    createCalendar(elem, year, month) {
        let mon = month - 1;
        let date = new Date(year, mon);
        let monthField = document.querySelector('.monthField');
        let yearField = document.querySelector('.yearField');
        yearField.innerHTML = year;

        switch (month) {
            case 1:
                monthField.innerHTML = 'Январь';
                break;
            case 2:
                monthField.innerHTML = 'Февраль';
                break;
            case 3:
                monthField.innerHTML = 'Март';
                break;
            case 4:
                monthField.innerHTML = 'Апрель';
                break;
            case 5:
                monthField.innerHTML = 'Май';
                break;
            case 6:
                monthField.innerHTML = 'Июнь';
                break;
            case 7:
                monthField.innerHTML = 'Июль';
                break;
            case 8:
                monthField.innerHTML = 'Август';
                break;
            case 9:
                monthField.innerHTML = 'Сентябрь';
                break;
            case 10:
                monthField.innerHTML = 'Октябрь';
                break;
            case 11:
                monthField.innerHTML = 'Ноябрь';
                break;
            case 12:
                monthField.innerHTML = 'Декабрь';
                break;
            default:
                alert('Нет такого месяца')
                break;
        }

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

        this.currentCompleteDateCell(this.popupedTask, year, month);

        let dayCells = document.querySelectorAll('.dateCell');
        for (let i = 0; i < dayCells.length; i++) {
            document.querySelector(`.js-day${i}`).addEventListener('click', () => this.chooseCompleteDate(this.popupedTask, i + 1, month, year))
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

    attachCalendarListeners(elem, year, month) {
        let prevMonthButton = document.querySelector('.js-prevMonth');
        let nextMonthButton = document.querySelector('.js-nextMonth');
        let prevYearButton = document.querySelector('.js-prevYear');
        let nextYearButton = document.querySelector('.js-nextYear');

        prevMonthButton.addEventListener('click', () => {
            if (month > 1) {
                this.createCalendar(elem, year, --month);
            } else {
                month = 12;
                this.createCalendar(elem, --year, month);
            }
        });
        nextMonthButton.addEventListener('click', () => {
            if (month < 12) {
                this.createCalendar(elem, year, ++month);
            } else {
                month = 1;
                this.createCalendar(elem, ++year, month);
            }
        });
        prevYearButton.addEventListener('click', () => this.createCalendar(elem, --year, month));
        nextYearButton.addEventListener('click', () => this.createCalendar(elem, ++year, month));
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
        popupDateField.innerHTML = `${task.completeDate.day}/${task.completeDate.month}/${task.completeDate.year}`
    }

    init(elem, year, month) {
        this.createCalendar(elem, year, month);
        this.attachCalendarListeners(elem, year, month);
    }
}

const modalTask = new Popup;
const modalGroups = new PopupGroups;
const modalCalendar = new Calendar;