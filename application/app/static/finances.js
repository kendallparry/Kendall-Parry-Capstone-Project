const folder = 'finances';
const fields = ['resourcename', 'purchasername', 'purchasermailbox'];

async function loadResources() {
    const res = await fetch(`/${folder}/files`);
    const keys = await res.json();
    const ul = document.querySelector('#resourcesList ul');
    ul.innerHTML = '';

    for (const key of keys) {
        const metadataRes = await fetch(`/metadata/${folder}/${key}`);
        const metadata = await metadataRes.json();

        const details = fields
            .map(field => metadata[field])
            .filter(Boolean)
            .join(' | ');

        const li = document.createElement('li');
        li.innerHTML = `
            <a href="/download/${folder}/${key}">${key}</a>
            ${details ? ` — ${details}` : ''}
        `;
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

    const formData = new FormData();
    formData.append('resourceFile', file);
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


loadResources();