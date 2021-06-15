import {
    Zettel, ZettelAdd, ZettelBatch, ZettelDetail, ZettelExport, ZettelImport,
    Kasten
} from "/file/js/zettel.js";
import { Lemma, LemmaComment, LemmaEdit, LemmaToProject } from "/file/js/lemma.js";
import {
    Library, LibraryEdit, LibrarySelector, LibraryScanImport,
    Opera, OperaExport, OperaUpdate, AuthorEdit, WorkEdit,
    FullTextSearch
} from "/file/js/opera.js";
import { Project, ProjectExport, ProjectOverview, ProjectZettelPreview } from "/file/js/project.js";
import { Account, Help } from "/file/js/settings.js";
import { Administration, AdministrationDetail, LocalDatabase, Statistics, Tests } from "/file/js/server.js";
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
            "kasten": Kasten,
            "lemma": Lemma,
            "lemma_comment": LemmaComment,
            "lemma_edit": LemmaEdit,
            "lemma_add": LemmaEdit,
            "lemma_addToProject": LemmaToProject,
            "library": Library,
            "library_edit": LibraryEdit,
            "library_selector": LibrarySelector,
            "library_scan_import": LibraryScanImport,
            "opera_mai": Opera,
            "opera_min": Opera,
            "opera_work_edit": WorkEdit,
            "opera_author_edit": AuthorEdit,
            "opera_update": OperaUpdate,
            "opera_export": OperaExport,
            "full_text": FullTextSearch,
            "project_overview": ProjectOverview,
            "project": Project,
            "project_export": ProjectExport,
            "project_zettel_preview": ProjectZettelPreview,
            "login": Login,
            "account_create": AccountCreate,
            "logout": Logout,
            "account": Account,
            "help": Help,
            "user_access": Administration,
            "user_access_detail": AdministrationDetail,
            "server_stats": Statistics,
            "local_database": LocalDatabase,
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
