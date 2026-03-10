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
        li.innerHTML = `
            <a href="/download/${folder}/${key}">${name}</a>
            ${details ? ` — ${details}` : ''}
        `;
        ul.appendChild(li);

        // Delete datalist option
        const option = document.createElement('option');
        option.value = key;
        datalist.appendChild(option);
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

    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }    

    await fetch(`/upload/${folder}`, { method: 'POST', body: formData });
    bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    loadResources();

    resourceName.value = "";
    resourceFile.value = null;
    purchaserName.value = "";
    purchaserMailbox.value = "";
});

document.getElementById('deleteResource').addEventListener('click', async () => {
    const key = document.getElementById('pickResource').value;
    if (!key) return alert('Please select a resource.');

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