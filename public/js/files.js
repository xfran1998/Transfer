import { AsyncTransfer } from "./async.js";

const toggleC = (element, className) => element.classList.toggle(className);
const addC = (element, className) => element.classList.add(className);
const removeC = (element, className) => element.classList.remove(className);
const preventD = (event) => event.preventDefault();

class Files {
    static async GenerateFileDrop(owner) {
        const folder_container = document.getElementById('folder-container');

        folder_container.innerHTML = "";

        let drop_items_html = Files.TemplateFileDrop();        
        let drop_items = document.createElement('div');
        drop_items.id = 'drop-items';
        drop_items.innerHTML = drop_items_html;

        // add event listener to drop items
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            drop_items.addEventListener(eventName, preventD, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            drop_items.addEventListener(eventName, () => {
                console.log('enter');
                addC(drop_items, 'green-border');
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            drop_items.addEventListener(eventName, () => {
                console.log('leave');
                removeC(drop_items, 'green-border');
            });
        });

        drop_items.addEventListener('drop', async (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            const formData = new FormData();  
            console.log(owner);  
            formData.append('owner', owner);
            [...files].forEach(file => {
                const name_file = file.name;
                formData.append(name_file, file);
            } );

            // formData.append('owner', owner);

            const url = `http://localhost:3000/api/admin/files/upload`;
            const json_resp = await AsyncTransfer.PostFilesAsync(url, formData);
            console.log(json_resp);
        });

        folder_container.appendChild(drop_items);
    }

    static async GenerateFolderPage(json_folder_files) {
        // json_folder_files: {name: '', files: [{name: '', size: ''}, {name: '', size: ''}]}
        const folder_container = document.getElementById('folder-container');
        Files.GenerateFileDrop(json_folder_files.name);


        json_folder_files.files.forEach(file => {
            let html = Files.TemplateFileContainer(json_folder_files.name, file);
            var file_container = document.createElement('div');
            
            file_container.classList.add('file-container');
            file_container.innerHTML = html;

            folder_container.appendChild(file_container);

            // add event listener to edit file
            file_container.querySelector('.file-edit').addEventListener('click', async (e) => {
                e.preventDefault();
                const user = e.currentTarget.getAttribute('data-user');
                const file = e.target.getAttribute('data-file');
             
                Files.PostEditFile(user, file, {type: 'rename', name: 'new_name'});
            });

            // add event listener to delete file
            file_container.querySelector('.file-delete').addEventListener('click', async (e) => {
                e.preventDefault();
                const user = e.currentTarget.getAttribute('data-user');
                const file = e.target.getAttribute('data-file');
                
                Files.PostEditFile(user, file, {type: 'delete'});
            });
        });
    }

    static async PostEditFile(owner, file, edit) {
        // owner: 'user' <string> | name of the user
        // file: 'file' <string> | name of the file
        // edit: {type: '', name: ''} <object> | what to edit and how
        // type: 'rename' or 'move'
        
        const url = `http://localhost:3000/api/admin/files/edit`;
        const json_resp = await AsyncTransfer.PostAPIAsync(url, {owner, file, edit});
        console.log(json_resp);

        if (json_resp.code !== 200) {
            alert (json_resp.message);
            return;
        }

        var file_container = document.querySelector(`[data-file="${file}"]`).parentElement.parentElement.parentElement;
        console.log(file_container);
        if (edit.type === 'rename') {
            file_container.querySelector('.text-name-file').innerHTML = edit.name;
        } else if (edit.type === 'delete') {
            file_container.remove();
        }
    }

    static TemplateFileContainer(owner, file){
        return `
            <div class="file-icon">
                <img src="http://localhost:3000/img/icon_file.svg" alt="file">
                <div class="file-buttons">
                    <button class="file-btn file-edit" data-user="${owner}" data-file="${file.name}"><i class="fa-solid fa-file-pen"></i></button>
                    <button class="file-btn file-delete" data-user="${owner}" data-file="${file.name}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="file-info">
                <p class="text-name-file">${file.name}</p>
                <p class="hidden-name-file">${file.name}</p>
            </div>
        `;
    }

    static TemplateFileDrop(){
        return `
            <i class="fa-solid fa-images"></i>
            <p>Suelta los archivos aquí</p>
            <p><small>Hasta 20 archivos</small></p>
        `;
    }
}

export { Files };