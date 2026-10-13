let editingLicenseId = null;

function loadLicenses() {
    fetch("/api/License")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load licenses");
            }
            return response.json();
        })
        .then(data => {
            const licenseList = document.getElementById("licenseList");
            licenseList.innerHTML = "";

            data.forEach(license => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${license.licenseKey}</td>
                    <td>${license.customerName}</td>
                    <td>${license.productName}</td>
                    <td>${license.expirationDate.substring(0, 10)}</td>
                    <td>${license.isActive ? "Active" : "Inactive"}</td>
                    <td></td>
                `;

                const actionsCell = row.lastElementChild;

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.onclick = function () {
                    editLicense(license);
                };

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.onclick = function () {
                    deleteLicense(license.id);
                };

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                licenseList.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error loading licenses:", error);
        });
}

function createLicense() {
    const license = {
        licenseKey: document.getElementById("licenseKey").value.trim(),
        customerName: document.getElementById("customerName").value.trim(),
        productName: document.getElementById("productName").value.trim(),
        expirationDate: document.getElementById("expirationDate").value,
        isActive: true
    };

    fetch("/api/License", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(license)
    })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            return response.json();
        })
        .then(() => {
            document.getElementById("licenseKey").value = "";
            document.getElementById("customerName").value = "";
            document.getElementById("productName").value = "";
            document.getElementById("expirationDate").value = "";

            loadLicenses();
        })
        .catch(error => {
            console.error("Error creating license:", error);
            alert("Could not create license: " + error.message);
        });
}

function editLicense(license) {
    editingLicenseId = license.id;

    document.getElementById("editLicenseKey").value =
        license.licenseKey;

    document.getElementById("editCustomerName").value =
        license.customerName;

    document.getElementById("editProductName").value =
        license.productName;

    document.getElementById("editExpirationDate").value =
        license.expirationDate.substring(0, 10);

    document.getElementById("editIsActive").checked =
        Boolean(license.isActive);

    const errorBox = document.getElementById("editError");
    errorBox.hidden = true;
    errorBox.textContent = "";

    document.getElementById("editModal").hidden = false;
    document.body.style.overflow = "hidden";

    document.getElementById("editLicenseKey").focus();
}

function closeEditModal() {
    document.getElementById("editModal").hidden = true;
    document.body.style.overflow = "";
    document.getElementById("editError").hidden = true;

    editingLicenseId = null;
}

async function saveLicenseEdit(event) {
    event.preventDefault();

    if (editingLicenseId === null) {
        return;
    }

    const saveButton = document.getElementById("saveEditButton");
    const errorBox = document.getElementById("editError");

    errorBox.hidden = true;
    errorBox.textContent = "";

    const updatedLicense = {
        licenseKey: document.getElementById("editLicenseKey").value.trim(),
        customerName: document.getElementById("editCustomerName").value.trim(),
        productName: document.getElementById("editProductName").value.trim(),
        expirationDate: document.getElementById("editExpirationDate").value,
        isActive: document.getElementById("editIsActive").checked
    };

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {
        const response = await fetch(
            `/api/License/${editingLicenseId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedLicense)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to update license.");
        }

        closeEditModal();
        loadLicenses();

    } catch (error) {
        console.error("Error updating license:", error);

        errorBox.textContent =
            "Could not update license. " + error.message;

        errorBox.hidden = false;

    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "Save Changes";
    }
}

function deleteLicense(id) {
    if (!confirm("Are you sure you want to delete this license?")) {
        return;
    }

    fetch(`/api/License/${id}`, {
        method: "DELETE"
    })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
        })
        .then(() => {
            loadLicenses();
        })
        .catch(error => {
            console.error("Error deleting license:", error);
            alert("Could not delete license: " + error.message);
        });
}

function deleteLicense(id) {
    deletingLicenseId = id;

    const errorBox = document.getElementById("deleteError");
    errorBox.hidden = true;
    errorBox.textContent = "";

    document.getElementById("deleteModal").hidden = false;
    document.body.style.overflow = "hidden";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").hidden = true;
    document.getElementById("deleteError").hidden = true;
    document.body.style.overflow = "";

    deletingLicenseId = null;
}

async function confirmDeleteLicense() {
    if (deletingLicenseId === null) {
        return;
    }

    const id = deletingLicenseId;
    const deleteButton = document.getElementById("deleteConfirmButton");
    const errorBox = document.getElementById("deleteError");

    errorBox.hidden = true;
    errorBox.textContent = "";

    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    try {
        const response = await fetch(`/api/License/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to delete license.");
        }

        closeDeleteModal();
        loadLicenses();

    } catch (error) {
        console.error("Error deleting license:", error);

        errorBox.textContent =
            "Could not delete license. " + error.message;

        errorBox.hidden = false;

    } finally {
        deleteButton.disabled = false;
        deleteButton.textContent = "Delete License";
    }
}

loadLicenses();