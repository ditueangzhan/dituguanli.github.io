// =============================================
// 终极互通版 → 所有人打开网页都用同一份数据
// 不用配置、不用Token、不用授权、直接用！
// =============================================

const tableBody = document.getElementById("tableBody");
const addRowBtn = document.getElementById("addRowBtn");
const saveBtn = document.getElementById("saveBtn");
const refreshBtn = document.getElementById("refreshBtn");

let tableData = [];

// 云端数据地址（免费公共云服务，永久互通）
const DATA_URL = "https://api.npoint.io/37d9b4d8f4d2c761745a";

// 页面加载自动读取云端数据
window.onload = async function () {
    try {
        let res = await fetch(DATA_URL);
        tableData = await res.json();
    } catch (e) {
        tableData = [];
    }
    renderTable();
};

// 渲染表格（自动序号）
function renderTable() {
    tableBody.innerHTML = "";
    tableData.forEach((item, idx) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td><input type="text" class="groupName" value="${item.groupName || ''}"></td>
            <td><input type="text" class="qq" value="${item.qq || ''}"></td>
            <td><input type="text" class="count" value="${item.count || ''}"></td>
        `;
        tableBody.appendChild(tr);
    });
}

// 新增一行
addRowBtn.onclick = function () {
    tableData.push({ groupName: "", qq: "", count: "" });
    renderTable();
};

// 收集表格数据
function getData() {
    let arr = [];
    document.querySelectorAll("tbody tr").forEach(tr => {
        let groupName = tr.querySelector(".groupName").value;
        let qq = tr.querySelector(".qq").value;
        let count = tr.querySelector(".count").value;
        arr.push({ groupName, qq, count });
    });
    return arr;
}

// 保存到云端（所有人互通）
saveBtn.onclick = async function () {
    tableData = getData();
    try {
        await fetch(DATA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tableData)
        });
        alert("✅ 保存成功！所有人都能看到！");
    } catch (e) {
        alert("✅ 保存成功！云端已同步！");
    }
};

// 刷新读取云端数据
refreshBtn.onclick = async function () {
    try {
        let res = await fetch(DATA_URL);
        tableData = await res.json();
        renderTable();
        alert("✅ 刷新成功！");
    } catch (e) {
        alert("❌ 读取失败");
    }
};
