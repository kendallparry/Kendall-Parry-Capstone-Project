const folder = 'finances';
const fields = ['purchasername', 'purchasermailbox'];

async function loadResources() {
    const res = await fetch(`/${folder}/files`);
    const keys = await res.json();
    const ul = document.querySelector('#resourcesList ul');
    ul.innerHTML = '';

    for (const key of keys) {
        const metadataRes = await fetch(`/metadata/${folder}/${key}`);
        const metadata = await metadataRes.json();

        const name = metadata['resourcename']

        const details = fields
            .map(field => metadata[field])
            .filter(Boolean)
            .join(' | ');

        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `/download/${folder}/${key}`;
        link.textContent = name;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn btn-sm btn-outline-danger ms-2';
        deleteBtn.addEventListener('click', () => deleteResource(key));

        li.appendChild(link);
        if (details) li.appendChild(document.createTextNode(` — ${details}`));
        li.appendChild(deleteBtn);
        ul.appendChild(li);
    };
}

document.getElementById('resourceSubmission').addEventListener('click', async () => {
    const file = document.getElementById('resourceFile').files[0];
    if (!file) return alert('Please select a file.');

    const resourceName = document.querySelector('#addModal #resourceName');
    const resourceFile = document.querySelector('#addModal #resourceFile');
    const purchaserName = document.querySelector('#addModal #purchaserName');
    const purchaserMailbox = document.querySelector('#addModal #purchaserMailbox');

    //add timestamp to file name to prevent overwriting in bucket
    const ext = file.name.includes('.') ? '.' + file.name.split('.').pop() : '';
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const uniqueFile = new File([file], `${baseName}_${Date.now()}${ext}`, { type: file.type });


    const formData = new FormData();
    formData.append('resourceFile', uniqueFile);
    formData.append('resourcename', resourceName.value);
    formData.append('purchasername', purchaserName.value);
    formData.append('purchasermailbox', purchaserMailbox.value);

    await fetch(`/upload/${folder}`, { method: 'POST', body: formData });
    bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    loadResources();

    resourceName.value = "";
    resourceFile.value = null;
    purchaserName.value = "";
    purchaserMailbox.value = "";
});

async function deleteResource(key) {
    if (!confirm("Are you sure you want to delete this receipt?")) return;
    await fetch(`/delete/${folder}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
    });
    loadResources();
}

loadResources();