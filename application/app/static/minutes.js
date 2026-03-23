const folder = 'minutes';

async function loadResources() {
    const res = await fetch(`/${folder}/files`);
    const keys = await res.json();
    const ul = document.querySelector('#resourcesList ul');
    ul.innerHTML = '';

    const datalist = document.getElementById('datalistOptions');
    datalist.innerHTML = '';

    keys.forEach(key => {
        // List item with download link
        const li = document.createElement('li');
        li.innerHTML = `<a href="/download/${folder}/${key}">${key}</a>`;
        ul.appendChild(li);

        // Delete datalist option
        const option = document.createElement('option');
        option.value = key;
        datalist.appendChild(option);
    });
}

document.getElementById('resourceSubmission').addEventListener('click', async () => {
    const file = document.getElementById('resourceFile').files[0];
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('resourceFile', file);

    await fetch(`/upload/${folder}`, { method: 'POST', body: formData });
    bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    loadResources();

    document.querySelector('#addModal #resourceName').value = "";
    document.querySelector('#addModal #resourceFile').value = "";
});

document.getElementById('deleteEvent').addEventListener('click', async () => {
    const key = document.getElementById('pickResource').value;
    if (!key) return alert('Please select a resource.');

    if (!confirm("Are you sure you want to delete this resource?")){
        return;
    }

    await fetch(`/delete/${folder}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
    });

    bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    loadResources();

    document.getElementById('pickResource').value = "";
});

loadResources();