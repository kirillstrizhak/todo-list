class Popup {
    constructor(popupHeading, popupText, popupedTask, popupGroups) {
        this.popupHeading = popupHeading;
        this.popupText = popupText;
        this.popupedTask = popupedTask;
        this.popupGroups = popupGroups;
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
                                <p>${task.completeDate.day}/${task.completeDate.month}/${task.completeDate.year}</p>
                                <button class="addOrChangeSettingBtn"><i class="fa-solid fa-calendar-days"></i></button></div>
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
        this.hideOnClick(this.popupedTask);
        this.popupGroups.init();
        //this.popupTaskTags.init()
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

// class PopupTaskTags {
//     constructor() {
//         this.colors = [
//             'Blue',
//             'Red',
//             'Green',
//             'Greenyellow',
//             'Pink',
//             'Violet'
//         ]
//     }

//     renderTag(tag) {
//         let tagTemplate = `
//         <div class="taskTag" style="background: ${tag.color};">
//             <span>${tag.name}</span>
//         </div>
//         `
//         return tagTemplate;
//     }

//     renderTagMenuTemplate() {
//         let menuBlock = document.querySelector('.tagsEditMenu');
//         menuBlock.innerHTML = `
//         <div class="tagsMenuDropdown">
//             <div class="tagsToolBar">
//                 <input class="searchTag" type="text" placeholder="Search for tag...">
//                 <button class="button createTagMenuOpener">Create tag</button>
//                 <div class="createTagMenu disabled" style="display: none;">
//                     <input type="text" class="createTagName" placeholder="Enter new tag name...">
//                     <div class="chooseColor">
//                         <div class="chooseColorToolBar">
//                             <span class="chooseColorBtn">Choose color</span>
//                             <span class="chooseColorCaret"><i class="fa-solid fa-caret-down"></i></span>
//                         </div>
//                         <div class="colorChooserDropdown"></div>
//                     </div>
//                     <div class="button createTagBtn">Create new tag</div>
//                 </div>
//             </div>
//             <div class="tagList"></div>
//         </div>`
//         this.renderColorList()

//         let addTagButton = document.querySelector('.createTagBtn');
//         let newTag = { name: 'New tag', color: 'rgb(255, 168, 82)' };
//         addTagButton.addEventListener('click', () => this.addTagToTagList(newTag));

//         document.querySelector('.createTagMenuOpener').addEventListener('click', () => this.showTagCreateMenu(newTag))

//     }

//     renderTagMenu() {
//         this.renderTagMenuTemplate();
//         let tagMenuDropdown = document.querySelector('.tagList');
//         let emptyTagMenu = '';
//         modalTask.tags.forEach(tag => {
//             emptyTagMenu += this.renderTag(tag);
//             return emptyTagMenu
//         });
//         tagMenuDropdown.innerHTML = emptyTagMenu;
//         this.collapseColorList()
//     }

//     collapseColorList() {
//         let collapsible = document.querySelector('.colorChooserDropdown');
//         let button = document.querySelector('.chooseColorToolBar');
//         let caret = document.querySelector('.chooseColorCaret');
//         button.addEventListener('click', () => {
//             if (collapsible.style.maxHeight && collapsible.style.display == 'block' && caret.style.transform) {
//                 caret.style.transform = null;
//                 collapsible.style.maxHeight = null;
//                 collapsible.style.display = 'none';
//             } else {
//                 caret.style.transform = 'rotate(180deg)'
//                 collapsible.style.maxHeight = 200 + 'px';
//                 collapsible.style.display = 'block';
//             }
//         })
//     }

//     showTagCreateMenu(newTag) {
//         let createTagMenu = document.querySelector('.createTagMenu')

//         this.selectColor(newTag);
//         if (createTagMenu.classList.contains('disabled')) {
//             createTagMenu.classList.remove('disabled');
//             createTagMenu.style.display = 'block';
//             modalTask.tags.push(newTag);
//         } else {
//             createTagMenu.classList.add('disabled');
//             createTagMenu.style.display = 'none';
//             modalTask.tags.pop(newTag);
//         }
//     }

//     addTagToTagList(intermediateTag) {
//         let addedTag = { name: this.createTagName(), color: intermediateTag.color };
//         modalTask.tags.push(addedTag);
//         modalTask.tags.splice(modalTask.tags.indexOf(intermediateTag), 1);

//         let createTagMenu = document.querySelector('.createTagMenu');
//         let tagList = document.querySelector('.tagList');

//         createTagMenu.classList.add('disabled');
//         createTagMenu.style.display = 'none';

//         tagList.insertAdjacentHTML('beforeend', this.renderTag(addedTag));
//         console.log(modalTask.tags)
//     }

//     createTagName() {
//         let tagNameInput = document.querySelector('.createTagName');
//         let tagName = tagNameInput.value;
//         return tagName;
//     }

//     renderColor(color) {
//         let colorTemplate = `
//             <div class="prev${color}">
//                 <div class="colorPrev" style="background: ${color};"></div>
//                 <span>${color}</span>
//             </div>
//         `
//         return colorTemplate;
//     }

//     renderColorList() {
//         let parent = document.querySelector('.colorChooserDropdown');
//         let emptyList = '';
//         this.colors.forEach(color => {
//             emptyList += this.renderColor(color);
//             return emptyList;
//         })
//         parent.innerHTML = emptyList;
//     }

//     selectColor(tag) {
//         this.colors.forEach(col => {
//             let colorBtn = document.querySelector(`.prev${col}`);
//             colorBtn.addEventListener('click', () => {
//                 tag.color = col
//             })
//         })

//     }

//     init() {
//         document.querySelector('.assignedTags').addEventListener('click', () => this.renderTagMenu())
//     }
// }
//const tags = new PopupTaskTags;


const modalTask = new Popup;
const modalGroups = new PopupGroups;