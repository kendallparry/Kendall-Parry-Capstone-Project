const folder = 'minutes';
const fields = ['resourcename'];

async function loadResources() {
    const res = await fetch(`/${folder}/files`);
    const keys = await res.json();
    const ul = document.querySelector('#resourcesList ul');
    ul.innerHTML = '';

    const datalist = document.getElementById('datalistOptions');
    datalist.innerHTML = '';

    for (const key of keys) {
        const metadataRes = await fetch(`/metadata/${folder}/${key}`);
        const metadata = await metadataRes.json();

        const name = metadata['resourcename']
        console.log(name);

        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `/download/${folder}/${key}`;
        link.textContent = name;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-sm btn-outline-danger ms-2';
        deleteButton.addEventListener('click', () => deleteResource(key));

        li.appendChild(link);
        li.appendChild(deleteButton);
        ul.appendChild(li);
    };
}

document.getElementById('resourceSubmission').addEventListener('click', async () => {
    const file = document.getElementById('resourceFile').files[0];
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('resourceFile', file);
    const resourceName = document.querySelector('#addModal #resourceName');
    formData.append('resourceName', resourceName.value);

    await fetch(`/upload/${folder}`, { method: 'POST', body: formData });
    bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    loadResources();

    document.querySelector('#addModal #resourceName').value = "";
    document.querySelector('#addModal #resourceFile').value = "";
});

async function deleteResource(key) {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    await fetch(`/delete/${folder}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
    });
    loadResources();
}

loadResources();