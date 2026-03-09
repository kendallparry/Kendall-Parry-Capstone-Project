const folder = 'finances';
const metadata = ['resourcename', 'purchasername', 'purchasermailbox'];

async function loadResources() {
    const res = await fetch(`/${folder}/files`);
    const keys = await res.json();
    const ul = document.querySelector('#resourcesList ul');
    ul.innerHTML = '';

    for (const key of keys) {
        const metadataRes = await fetch(`/metadata/${folder}/${key}`);
        const metadata = await metadataRes.json();

        const li = document.createElement('li');
        li.innerHTML = `
            <a href="/download/${folder}/${key}">${key}</a>
            <p>
                ${metadata.resourcename ? `| ${metadata.resourcename}` : ''}
                ${metadata.purchasername ? `| ${metadata.purchasername}` : ''}
                ${metadata.purchasermailbox ? `| ${metadata.purchasermailbox}` : ''}
            <p>
        
        `;
        ul.appendChild(li);

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

    const formData = new FormData();
    formData.append('resourcefile', file);
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


loadResources();