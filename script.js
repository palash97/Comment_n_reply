const flexRow = {
    display: 'flex',
    flexDirection: 'row'
}

const flexColumn = {
    display: 'flex',
    flexDirection: 'column'
}

const setStylesOnElement = function(element, styles){
    Object.assign(element.style, styles);
}

const createButton = (text) => {
    let button = document.createElement('button');
    button.innerHTML = text;
    button.style.marginLeft = '10px';
    return button;
}

let commentList = JSON.parse(sessionStorage.getItem('commentList') || "[]");
let commentId = JSON.parse(sessionStorage.getItem('commentId') || "0");

const replyComment = (id, marginLeft) => {

    const replyDiv = document.createElement('div');
    setStylesOnElement(replyDiv, flexRow);

    const textarea = document.createElement("textarea");
    textarea.style.marginLeft = '10px';

    const reply = createButton('Reply');
    const cancel = createButton('Cancel');

    replyDiv.appendChild(textarea);
    replyDiv.appendChild(reply);
    replyDiv.appendChild(cancel);
    replyDiv.id = id + 'replyDiv';

    document.getElementById(id).appendChild(replyDiv);
    cancel.onclick = () => document.getElementById(id + 'replyDiv').remove();

    const array_id = id.split("_");
    const hLevel = array_id.length-1;

    reply.onclick = () => {
        let finder = (list_, level) => {
            if(level < hLevel){
                finder(list_[array_id[level]].childComments, level+1);
            }
            else{
                let rList = list_[array_id[level]];
                let element = createNewCommentElement(textarea.value, id + "_" + rList.childComments.length.toString(), marginLeft + 30);
                rList.childComments.push({
                    text: textarea.value,
                    id: id + "_" + rList.childComments.length.toString(),
                    childComments: []
                });
                document.getElementById(id).appendChild(element);
                sessionStorage.setItem('commentList', JSON.stringify(commentList));
                document.getElementById(id + 'replyDiv').remove();
            }
        }
        finder(commentList, 0);
    }
}

// const delComment = (id) => {

//     document.getElementById(id).remove();

//     const array_id = id.split("_");
//     const hLevel = array_id.length-1;

//     let finder = (list_, level) => {
//         if(level < hLevel){
//             finder(list_[array_id[level]].childComments, level+1);
//         }
//         else{
//             console.log(list_[array_id[level]]);
//             delete list_[array_id[level]];
//         }
//     }
//     finder(commentList, 0);
//     sessionStorage.setItem('commentList', JSON.stringify(commentList));
// }

const renderComments = (list, parentId, marginLeft) => {
    list.map(item => {
        let element = createNewCommentElement(item.text, item.id, marginLeft);
        document.getElementById(parentId).appendChild(element);
        if(item.childComments.length){
            renderComments(item.childComments, item.id, marginLeft + 30);
        }
    });
}

if(document.getElementById("commentList").childElementCount == 0 && commentList.length){
    renderComments(commentList, "commentList", 0);
}

function addComment(e){
    const comment = {
        text: document.getElementById("newComment").value,
        id: commentId.toString(),
        childComments: []
    }
    commentList.push(comment);
    const element = createNewCommentElement(comment.text, commentId.toString(), 0);
    document.getElementById("commentList").appendChild(element);
    document.getElementById("newComment").value = "";
    sessionStorage.setItem('commentList', JSON.stringify(commentList));
    commentId = commentId + 1;
    sessionStorage.setItem('commentId', JSON.stringify(commentId));
}

function createNewCommentElement(text, id, marginLeft){

    const parentDiv = document.createElement("div");
    setStylesOnElement(parentDiv, flexColumn);
    parentDiv.style.alignItems = 'center';
    parentDiv.style.marginLeft = marginLeft.toString() + "px";
    parentDiv.id = id;

    const div = document.createElement("div");
    setStylesOnElement(div, flexRow);
    div.style.alignItems = 'center';
    div.style.marginLeft = marginLeft.toString() + "px";

    const para = document.createElement("p");
    para.style.width = '500px';
    para.style.borderStyle = 'inset';
    para.style.padding = '5px';
    para.innerHTML = text;

    //const edit = createButton('Edit');

    const reply = createButton('Reply');
    reply.onclick = () => replyComment(id, marginLeft);

    // const del = createButton('Delete');
    // del.onclick = () => delComment(id);

    div.appendChild(para);
    //div.appendChild(edit);
    div.appendChild(reply);
    //div.appendChild(del);

    parentDiv.appendChild(div);

    return parentDiv;
}