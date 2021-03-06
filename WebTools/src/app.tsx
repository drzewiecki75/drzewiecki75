import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {character} from './common/character';
import {Events, EventIdentity} from './common/eventChannel';
import {PageIdentity} from './pages/pageFactory';
import {Page} from './pages/pageBase';
import {History} from './components/history';

class Application {
    private _activePage: PageIdentity;

    constructor() {
        this._activePage = PageIdentity.ToolSelection;
    }

    start() {
        this.initialize();
        this.render();
    }

    private initialize() {
        Events.listen(EventIdentity.ShowPage, (page: PageIdentity) => {
            this.activatePage(page, false);
        });

        Events.listen(EventIdentity.HistoryBack, (page: PageIdentity) => {
            this.activatePage(page, true);
        });
    }

    private activatePage(page: PageIdentity, isHistory: boolean) {
        var body = document.getElementsByTagName("html")[0];
        if (body) {
            body.scrollTop = 0;
        }

        if (page === this._activePage) {
            var pageComponent = document.getElementsByClassName('page')[0];
            pageComponent.classList.remove('page-out');
            return;
        }

        this._activePage = page;

        if (!isHistory) {
            character.saveStep(this._activePage);
        }

        this.render();
    }

    private render() {
        ReactDOM.render(
            React.createElement(Page, {
                page: this._activePage
            }),
            document.getElementById("app"));

        ReactDOM.render(
            React.createElement(History),
            document.getElementById("history"));
    }
}

const app = new Application();
app.start();