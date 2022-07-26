import React, { useEffect, useState } from 'react'
import nodata from '../../assets/nodata.jpg';
import $ from 'jquery'
import axios from 'axios';
import Swal from 'sweetalert2'
import Joi from 'joi';


export default function Home({ userinfo }) {

  const [nonotesfound, setnonotesfound] = useState(false)
  const [pageloading, setpageloading] = useState(false)
  const [noteslist, setnoteslist] = useState([])
  const [validaterror, setvalidaterror] = useState([])
  const [validaterroru, setvalidaterroru] = useState([])
  const [loading_btnu, setloading_btnu] = useState(false)
  const [loading_btn, setloading_btn] = useState(false)
  const [errormessage, seterrormessage] = useState(null)
  const [errormessageu, seterrormessageu] = useState(null)
  const [note, setnote] = useState({
    title: "",
    desc: "",
    userID: "",
    token: ""
  })
  const [updatanote, setupdatanote] = useState({
    title: "",
    desc: "",
    NoteID: "",
    token: ""
  });

// ------------------------------------------------------- updata notes -------------------------------------------------------

  // eslint-disable-next-line no-unused-vars
  let NoteID;
  function fupdatanote(e) {
    updatanote[e.target.name] = e.target.value;
    if ($("#note_titleu").val().length > 0 && $("#note_descu").val().length > 0) {
      $("#note_updata_btn").attr("disabled", false);
    } else {
      $("#note_updata_btn").attr("disabled", true);
    }
  }
  function getmodalupdata (e) {
    $("#note_titleu").val(e.target.getAttribute("data-note-title"));
    $("#note_descu").val(e.target.getAttribute("data-note-desc"));
    NoteID = e.target.getAttribute("data-note-id");

    updatanote.title = e.target.getAttribute("data-note-title");
    updatanote.desc = e.target.getAttribute("data-note-desc");
    updatanote.token = localStorage.getItem("usernotesToken");
    updatanote.NoteID = e.target.getAttribute("data-note-id")
  }

  function valditeupdatanote () {
    let vaildunote = Joi.object({
      title: Joi.string().min(5).required(),
      desc: Joi.string().min(5).required(),
      NoteID: Joi.optional(),
      token: Joi.optional()
    });
    return vaildunote.validate(updatanote, { abortEarly: false });
  }

  async function submitupdatanote(e) {
    e.preventDefault();
    let validtereuslt = valditeupdatanote();
    if (validtereuslt.error == null) {
      setloading_btnu(true)
      let { data } = await axios.put("https://route-egypt-api.herokuapp.com/updateNote", updatanote)
      if (data.message === "updated") {
        setloading_btnu(false);
        Swal.fire(
          'success!',
          'Your note has been updated!',
          'success'
        )
        cleanupdatamodal()
        getusernots()
      } else {
        seterrormessageu(data.errors)
        setloading_btnu(false);
      }
    } else {
      setvalidaterroru(validtereuslt.error.details)
    }
  }
// ------------------------------------------------------- add notes -------------------------------------------------------

  function getnotedata(e) {
    let newnote = { ...note }
    newnote[e.target.name] = e.target.value;
    newnote.token = localStorage.getItem("usernotesToken");
    newnote.userID = userinfo._id;
    setnote(newnote);
    if ($("#note_title").val().length > 0 && $("#note_desc").val().length > 0) {
      $("#note_btn").attr("disabled", false);
    } else {
      $("#note_btn").attr("disabled", true);
    }
  }

  function valditenote() {
    let vaildnote = Joi.object({
      title: Joi.string().min(5).required(),
      desc: Joi.string().min(5).required(),
      userID: Joi.optional(),
      token: Joi.optional()
    });
    return vaildnote.validate(note, { abortEarly: false });
  }

  async function submitnote(e) {
    e.preventDefault();
    let validtereuslt = valditenote();
    if (validtereuslt.error == null) {
      setloading_btn(true)
      let { data } = await axios.post("https://route-egypt-api.herokuapp.com/addNote", note)
      if (data.message === "success") {
        setloading_btn(false);
        Swal.fire(
          'success!',
          'Your note has been added!',
          'success'
        )
        cleanmodal()
        getusernots()
      } else {
        seterrormessage(data.errors)
        setloading_btn(false);
      }
    } else {
      setvalidaterror(validtereuslt.error.details)
    }
  }

// ------------------------------------------------------- get user notes -------------------------------------------------------

  async function getusernots() {
    setpageloading(true)
    let { data } = await axios.get('https://route-egypt-api.herokuapp.com/getUserNotes', {
      headers: {
        'Token': `${localStorage.getItem("usernotesToken")}`,
        'userID': `${userinfo._id}`
      }
    })
    if (data.message === "success") {
      setnoteslist(data.Notes)
      setpageloading(false)
      setnonotesfound(false)
    }
    if (data.message === "no notes found") {
      setnoteslist([])
      setpageloading(false)
      setnonotesfound(true)
    }
    if (data.message === "Network Error") {
      console.log("no internent conection");
    }
  }

  useEffect(() => {
    if (userinfo !== null) {
      getusernots()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

// ------------------------------------------------------- delete notes -------------------------------------------------------
  function DeleteNote(e) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        confiemdelet(e)
      }
    })
  }

  async function confiemdelet(e) {
    setpageloading(true)
    let { data } = await axios.delete('https://route-egypt-api.herokuapp.com/deleteNote', {
      data: {
        NoteID: `${e.target.getAttribute("data-note-id")}`,
        token: `${localStorage.getItem("usernotesToken")}`
      }
    })
    if (data.message === "deleted") {
      setpageloading(false)
      Swal.fire(
        'Deleted!',
        'Your notes has been deleted.',
        'success'
      )
      getusernots()
    }
  }

// ------------------------------------------------------- clean modals after finish -------------------------------------------------------

  function cleanmodal() {
    $(".swal2-confirm").attr("data-bs-dismiss", "modal");
    $(".swal2-confirm").attr("data-bs-target", "#notemodal");
    $("#note_form")[0].reset();
    $("#note_btn").attr("disabled", true);
    setvalidaterror([])
    setnote({
      title: "",
      desc: "",
      userID: "",
      token: ""
    })
  }

  function cleanupdatamodal() {
    $(".swal2-confirm").attr("data-bs-dismiss", "modal");
    $(".swal2-confirm").attr("data-bs-target", "#updatanotemodal");
    $("#update_note_form")[0].reset();
    $("#note_updata_btn").attr("disabled", true);
    // setvalidaterroru([])
    setupdatanote({
      title: "",
      desc: "",
      NoteID: "",
      token: ""
    })
  }

// ------------------------------------------------------- textarea counter -------------------------------------------------------

  function textcounter(e) {
    $(".counter").text(e.target.value.length);
    if (e.target.value.length > 250) {
      $(".counter").addClass("text-danger");
    } else {
      $(".counter").removeClass("text-danger");
    }
  }
// ------------------------------------------------------- tragger notes color -------------------------------------------------------

useEffect(() => {
  $("#aqua").on("click", function () {
    $(".note-box").addClass("basic-card-aqua").removeClass("basic-card-lips basic-card-light basic-card-dark")
  });
  $("#lips").on("click", function () {
    $(".note-box").addClass("basic-card-lips").removeClass("basic-card-aqua basic-card-light basic-card-dark")
  });
  $("#light").on("click", function () {
    $(".note-box").addClass("basic-card-light").removeClass("basic-card-lips basic-card-aqua basic-card-dark")
  });
  $("#dark").on("click", function () {
    $(".note-box").addClass("basic-card-dark").removeClass("basic-card-lips basic-card-light basic-card-aqua")
  });

}, [])
// ------------------------------------------------------- xml rendar -------------------------------------------------------
  return (
    <div className='container pt-4 parant'>


      <div className="float-end me-3">
{/*  ------------------------------------------------------- Button trigger modal ------------------------------------------------------- */}
        <button type="button" className="btn btn-primary rounded-circle" data-bs-toggle="modal" data-bs-target="#notemodal">
          <i className='fa-solid fa-plus'></i>
        </button>
{/*  ------------------------------------------------------- Button trigger colors ------------------------------------------------------- */}
        <div className="button-circle mt-5 basic-card-aqua" id='aqua'></div>
        <div className="button-circle basic-card-lips" id='lips'></div>
        <div className="button-circle basic-card-light" id='light'></div>
        <div className="button-circle basic-card-dark" id='dark'></div>
      </div>

{/*  ------------------------------------------------------- photo show when no notes found ------------------------------------------------------- */}

      {(nonotesfound) ? <> <div className="no-data text-center h-100 d-flex justify-content-center align-items-center">
        <div>
          <img src={nodata} alt="nodataphoto" />
          <p className='text-muted fw-bold mt-4'>you don't have any notes yet</p>
        </div>
      </div>
      </> : ""}

{/*  ------------------------------------------------------- loading icon ------------------------------------------------------- */}

      {(pageloading) ? <> <div className='page-loading'> <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div> </div>
      </> : ""}

{/*  ------------------------------------------------------- notes loop ------------------------------------------------------- */}

      <div className="notes-box me-5 pe-4 ">
        <div className="row">
          {noteslist.map((e, i) => {
            return <div key={i} className="col-sm-6 col-md-4 col-xl-3 pb-3 position-relative ">
              <div className="note-box">
                <h5 className='fw-bold mb-3 pe-2'>{e.title}</h5>
                <p className='mb-0'>{e.desc}</p>
                <div className="box-option">
                  <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></span>
                  <ul className="dropdown-menu overflow-hidden">
                    <li className="dropdown-item" onClick={getmodalupdata} data-note-title={e.title} data-note-desc={e.desc} data-note-id={e._id} data-bs-toggle="modal" data-bs-target="#updatanotemodal"> <i className="fa-solid fa-pen-to-square me-2" ></i> edit</li>
                    <li className="dropdown-item" data-note-id={e._id} onClick={DeleteNote}> <i className="fa-solid fa-trash-can me-2"></i> delete</li>
                  </ul>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------- add note Modal ------------------------------------------------------------------------------*/}
      <div className="modal fade" id="notemodal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">add note</h5>
            </div>
            <form id='note_form' onSubmit={submitnote} >
              <div className="modal-body">
                {(errormessage) ? <div className="alert alert-danger mt-3 p-2"> {errormessage} </div> : ""}
                {validaterror.map((e, i) => { return <p className='text-danger fs-sm' key={i} >{e.message}</p> })}
                <input onChange={getnotedata} type="text" name="title" id="note_title" className='form-control' placeholder='Note Title' />
                <div className="desc position-relative">
                  <textarea onChange={getnotedata} onKeyUp={textcounter} name="desc" id="note_desc" className='form-control mt-3' rows="5" placeholder='Note Descrption'></textarea>
                  <span className='counter'>0</span>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button onClick={cleanmodal} type="button" className="btn btn-danger" data-bs-dismiss="modal" id='modal_close'>Close</button>
                <button id='note_btn' type="submit" className="btn btn-primary" disabled> {(loading_btn) ? <span> <i className='fa-solid fa-spinner fa-spin me-1'></i> Loading </span> : "Add Note"} </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------- updata note Modal -------------------------------------------------------------------------------*/}
      <div className="modal fade" id="updatanotemodal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">updata note</h5>
            </div>
            <form id='update_note_form' onSubmit={submitupdatanote} >
              <div className="modal-body">
                {(errormessageu) ? <div className="alert alert-danger mt-3 p-2"> {errormessageu} </div> : ""}
                {validaterroru.map((e, i) => { return <p className='text-danger fs-sm' key={i} >{e.message}</p> })}
                <input onChange={fupdatanote} type="text" name="title" id="note_titleu" className='form-control' placeholder='Note Title' />
                <textarea onChange={fupdatanote} name="desc" id="note_descu" className='form-control mt-3' rows="5" placeholder='Note Descrption'></textarea>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button onClick={cleanupdatamodal} type="button" className="btn btn-danger" data-bs-dismiss="modal" id='modal_close'>Close</button>
                <button id='note_updata_btn' type="submit" className="btn btn-primary" disabled> {(loading_btnu) ? <span> <i className='fa-solid fa-spinner fa-spin me-1'></i> Loading </span> : "updata Note"} </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}
