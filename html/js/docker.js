import { Zettel, ZettelAdd, ZettelBatch, ZettelDetail } from "/file/js/zettel.js";
import { Lemma, LemmaComment, LemmaEdit, LemmaToProject } from "/file/js/lemma.js";
import { Library, OperaMaiora, OperaMinora } from "/file/js/opera.js";
import { Project, ProjectOverview } from "/file/js/project.js";
import { Account, Help, Version } from "/file/js/settings.js";
import { Administration, Statistics, Tests } from "/file/js/server.js";
import { Login } from "/file/js/account.js";
import { Viewer } from "/file/js/library.js";

export class Docker{
    constructor(){
        this.dock = {
            "zettel": Zettel,
            "zettel_add": ZettelAdd,
            "zettel_batch": ZettelBatch,
            "zettel_detail": ZettelDetail,
            "lemma": Lemma,
            "lemma_comment": LemmaComment,
            "lemma_edit": LemmaEdit,
            "lemma_add": LemmaEdit,
            "lemma_addToProject": LemmaToProject,
            "library": Library,
            "opera_mai": OperaMaiora,
            "opera_min": OperaMinora,
            "project_overview": ProjectOverview,
            "project": Project,
            "login": Login,
            "account": Account,
            "help": Help,
            "version": Version,
            "user_access": Administration,
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
