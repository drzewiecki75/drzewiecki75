import React = require("react");
import { DropDownInput } from "../components/dropDownInput";
import { Skill, SkillsHelper } from "../helpers/skills";
import { TalentsHelper } from "../helpers/talents";
import { Source } from "../helpers/sources";
import { character } from "../common/character";

class TalentViewModel {
    name: string;
    description: string;
    prerequisites: string;

    constructor(name: string, description: string, prerequisites: string) {
        this.name = name;
        this.description = description;
        this.prerequisites = prerequisites;
    }
}

export class TalentsOverviewPage extends React.Component<{}, {}> {
    private _categories: string[] = [];
    private _category: string = "";
    private _talents: { [category: string]: TalentViewModel[] } = {};

    constructor(props: {}) {
        super(props);

        this.setupCategories();
        this.loadTalents();
    }

    render() {
        const talents = this._talents[this._category].map((t, i) => {
            return (
                <tr key={i}>
                    <td className="selection-header">
                        {t.name}
                    </td>
                    <td>{t.description}</td>
                </tr>
            );
        });

        return (
            <div>
                <div className="float-top">
                    <DropDownInput items={this._categories} defaultValue={this._category} onChange={(index) => { this.onCategoryChanged(index); }} />
                </div>
                <div className="page">
                    <table className="selection-list">
                        <tbody>
                            {talents}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    private setupCategories() {
        for (let sk in Object.keys(Skill).filter(skill => !isNaN(Number(Skill[skill])))) {
            let s = SkillsHelper.getSkillName(Number(sk));
            console.log(s);
            this._categories.push(s);
        }

        this._categories = this._categories.sort((a, b) => a.localeCompare(b));
        this._category = this._categories[0];

        for (var c = 0; c < this._categories.length; c++) {
            const category = this._categories[c];
            if (!this._talents[category]) {
                this._talents[category] = [];
            }
        }
    }

    private loadTalents() {
        for (var i = 0; i < this._categories.length; i++) {
            const category = this._categories[i];
            const talents = TalentsHelper.getTalents()[SkillsHelper.toSkill(category)];
            for (var j = 0; j < talents.length; j++) {
                const talent = talents[j];
                this._talents[category].push(new TalentViewModel(talent.name, talent.description, this.prerequisitesToString(talent.prerequisites)));
            }

            this._talents[category].sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    private hasTalent(talents: TalentViewModel[], name: string) {
        return (talents.some(t => t.name === name));
    }

    private prerequisitesToString(pre: {}[]) {
        return "";
    }

    private onCategoryChanged(index: number) {
        this._category = this._categories[index];
        this.forceUpdate();
    }
}