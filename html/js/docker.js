import { Zettel, ZettelAdd, ZettelBatch, ZettelDetail, ZettelExport, ZettelImport } from "/file/js/zettel.js";
import { Lemma, LemmaComment, LemmaEdit, LemmaToProject } from "/file/js/lemma.js";
import { Library, LibraryEdit, LibrarySelector, LibraryUpdate, Opera, OperaExport, OperaUpdate, AuthorEdit, WorkEdit } from "/file/js/opera.js";
import { Project, ProjectOverview, ProjectZettelPreview } from "/file/js/project.js";
import { Account, Help } from "/file/js/settings.js";
import { Administration, AdministrationDetail, Statistics, Tests } from "/file/js/server.js";
import { Login, AccountCreate, Logout } from "/file/js/account.js";
import { Viewer } from "/file/js/library.js";

export class Docker{
    constructor(){
        this.dock = {
            "zettel": Zettel,
            "zettel_add": ZettelAdd,
            "zettel_batch": ZettelBatch,
            "zettel_detail": ZettelDetail,
            "zettel_lemma_add": LemmaEdit,
            "zettel_export": ZettelExport,
            "zettel_import": ZettelImport,
            "lemma": Lemma,
            "lemma_comment": LemmaComment,
            "lemma_edit": LemmaEdit,
            "lemma_add": LemmaEdit,
            "lemma_addToProject": LemmaToProject,
            "library": Library,
            "library_edit": LibraryEdit,
            "library_selector": LibrarySelector,
            "library_update": LibraryUpdate,
            "opera_mai": Opera,
            "opera_min": Opera,
            "opera_work_edit": WorkEdit,
            "opera_author_edit": AuthorEdit,
            "opera_update": OperaUpdate,
            "opera_export": OperaExport,
            "project_overview": ProjectOverview,
            "project": Project,
            "project_zettel_preview": ProjectZettelPreview,
            "login": Login,
            "account_create": AccountCreate,
            "logout": Logout,
            "account": Account,
            "help": Help,
            "user_access": Administration,
            "user_access_detail": AdministrationDetail,
            "server_stats": Statistics,
            "tests": Tests,
            "viewer": Viewer
        }
    }
    load(res, resId = null, access= [], main = false){
        if(this.dock[res] != null){
            return new this.dock[res](res, resId, access, main);
        }else{throw `Docker: No dock found for res "${res}".`}
    }
}
