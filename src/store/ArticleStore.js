import { decorate, observable, action } from "mobx";
import firebase from "firebase/app";
import "firebase/firestore";

class ArticleStore {
  loadSize = 10;
  state = "new";
  filter = "all";
  articles = [];
  last = null;
  hasMore = false;
  collectionRef = null;

  restoreArticle = article => {
    let insertFbId = article.fb_id;
    delete article.fb_id;

    firebase
      .firestore()
      .collection("article")
      .doc(insertFbId)
      .set(article)
      .then(() => {
        this.articles.unshift({
          ...article,
          fb_id: insertFbId
        });
      });
  };

  removeArticle = fb_id => {
    firebase
      .firestore()
      .collection("article")
      .doc(fb_id)
      .delete()
      .then(() => {
        this.articles = this.articles.filter(article => {
          return article.fb_id !== fb_id;
        });
      });
  };

  keepArticle = fb_id => {
    firebase
      .firestore()
      .collection("article")
      .doc(fb_id)
      .update({
        state: "keep"
      })
      .then(() => {
        this.articles = this.articles.filter(article => {
          return article.fb_id !== fb_id;
        });
      });
  };

  resetArticles = () => {
    this.state = "new";
    this.filter = "all";
    this.articles = [];
    this.last = null;
    this.collectionRef = null;
  };

  setState = value => {
    this.state = value;
    this.articles = [];
    this.firstLoad();
  };

  setFilter = value => {
    this.filter = value;
    this.articles = [];
    this.firstLoad();
  };

  firstLoad = () => {
    let collectionRef = firebase
      .firestore()
      .collection("article")
      .where("state", "==", this.state);

    let filterRef =
      this.filter !== "all"
        ? collectionRef
            .where("type", "==", this.filter)
            .orderBy("timestamp", "desc")
        : collectionRef.orderBy("timestamp", "desc");
    this.collectionRef = filterRef;

    this.collectionRef
      .limit(this.loadSize)
      .get()
      .then(snapshot => {
        if (snapshot.docs.length < this.loadSize) this.hasMore = false;
        else this.hasMore = true;
        this.last = snapshot.docs[snapshot.docs.length - 1];
        snapshot.forEach(document => {
          let articleData = document.data();
          this.articles.push({
            ...articleData,
            fb_id: document.id
          });
        });
      });
  };

  loadMore = () => {
    if (this.collectionRef !== null) {
      this.collectionRef
        .startAfter(this.last.data().timestamp)
        .limit(this.loadSize)
        .get()
        .then(snapshot => {
          if (snapshot.docs.length < this.loadSize) this.hasMore = false;
          else this.hasMore = true;
          this.last = snapshot.docs[snapshot.docs.length - 1];
          snapshot.forEach(document => {
            let articleData = document.data();
            this.articles.push({
              ...articleData,
              fb_id: document.id
            });
          });
        });
    }
  };

  refresh = () => {
    this.articles = [];
    this.last = null;
    this.collectionRef = null;
    this.firstLoad();
  };
}

decorate(ArticleStore, {
  state: observable,
  filter: observable,
  articles: observable,
  hasMore: observable,
  resetArticles: action,
  setFilter: action,
  setState: action,
  firstLoad: action,
  loadMore: action
});

export default ArticleStore;
