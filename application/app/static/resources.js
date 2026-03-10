const folder = 'resources';
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

        const li = document.createElement('li');
        li.innerHTML = `
            <a href="/download/${folder}/${key}">${name}</a>
        `;
        ul.appendChild(li);

        // Delete datalist option
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
    };
}

document.getElementById('resourceSubmission').addEventListener('click', async () => {
    const file = document.getElementById('resourceFile').files[0];
    if (!file) return alert('Please select a file.');

    //add timestamp to file name to prevent overwriting in bucket
    const ext = file.name.includes('.') ? '.' + file.name.split('.').pop() : '';
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const uniqueFile = new File([file], `${baseName}_${Date.now()}${ext}`, { type: file.type });

    const resourceName = document.querySelector('#addModal #resourceName');

    const formData = new FormData();
    formData.append('resourceFile', uniqueFile);
    formData.append('resourceName', resourceName.value);

    await fetch(`/upload/${folder}`, { method: 'POST', body: formData });
    bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    loadResources();

    resourceName.value = "";
    document.querySelector('#addModal #resourceFile').value = "";
});

document.getElementById('deleteResource').addEventListener('click', async () => {
    const name = document.getElementById('pickResource').value;
    if (!name) return alert('Please select a resource.');

    const res = await fetch(`/${folder}/files`);
    const keys = await res.json();

    let matchedKey = null;
    for (const key of keys) {
        const metadataRes = await fetch(`/metadata/${folder}/${key}`);
        const metadata = await metadataRes.json();
        if (metadata['resourcename'] === name) {
            matchedKey = key;
            break;
        }
    }

    if (!matchedKey) return alert('Resource not found.');

    await fetch(`/delete/${folder}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: matchedKey })
    });

    bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    loadResources();
    document.getElementById('pickResource').value = "";
});

loadResources();