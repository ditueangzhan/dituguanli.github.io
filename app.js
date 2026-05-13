// 已帮你全部填好，无需修改
const GIT_USER = "ditueangzhan";
const GIT_REPO = "dituguanli.github.io";
const GIT_BRANCH = "main";
const GIT_TOKEN = "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";

const filePath = "tableData.json";
const apiBase = `https://api.github.com/repos/${GIT_USER}/${GIT_REPO}/contents/${filePath}`;

// DOM
const tableBody = document.getElementById("tableBody");
const addRowBtn = document.getElementById("addRowBtn");
const saveBtn = document.getElementById("saveBtn");
const refreshBtn = document.getElementById("refreshBtn");

let tableData = [];

// 渲染表格 + 自动序号
function renderTable() {
    tableBody.innerHTML = "";
    tableData.forEach((item, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td><input type="text" class="groupName" value="${item.groupName || ''}"></td>
            <td><input type="text" class="qq" value="${item.qq || ''}"></td>
            <td><input type="text" class="count" value="${item.count || ''}"></td>
        `;
        tableBody.appendChild(tr);
    });
}

// 新增空行
addRowBtn.addEventListener("click", () => {
    tableData.push({
        groupName: "",
        qq: "",
        count: ""
    });
    renderTable();
});

// 收集表格数据
function collectData() {
    const rows = tableBody.querySelectorAll("tr");
    const arr = [];
    rows.forEach(tr => {
        const groupName = tr.querySelector(".groupName").value.trim();
        const qq = tr.querySelector(".qq").value.trim();
        const count = tr.querySelector(".count").value.trim();
        arr.push({ groupName, qq, count });
    });
    return arr;
}

// 读取云端数据
async function readFromGit() {
    try {
        const res = await fetch(`${apiBase}?ref=${GIT_BRANCH}`, {
            headers: { Authorization: `token ${GIT_TOKEN}` }
        });
        const json = await res.json();
        const content = atob(json.content);
        tableData = JSON.parse(content);
        renderTable();
        alert("读取成功");
    } catch (e) {
        tableData = [];
        renderTable();
        alert("暂无云端数据，已新建空白表格");
    }
}

// 保存到云端
async function saveToGit() {
    tableData = collectData();
    try {
        const res = await fetch(`${apiBase}?ref=${GIT_BRANCH}`, {
            headers: { Authorization: `token ${GIT_TOKEN}` }
        });
        const fileInfo = await res.json();
        const sha = fileInfo.sha;

        const str = JSON.stringify(tableData, null, 2);
        const base64 = btoa(unescape(encodeURIComponent(str)));

        await fetch(apiBase, {
            method: "PUT",
            headers: {
                Authorization: `token ${GIT_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "更新玩家组表格数据",
                content: base64,
                sha: sha,
                branch: GIT_BRANCH
            })
        });
        alert("保存成功！所有人刷新即可同步");
    } catch (e) {
        alert("保存失败，检查仓库文件是否建好");
    }
}

// 绑定按钮
saveBtn.onclick = saveToGit;
refreshBtn.onclick = readFromGit;

// 页面自动读取
window.onload = readFromGit;
