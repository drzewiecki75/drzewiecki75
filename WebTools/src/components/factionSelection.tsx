import * as React from 'react';
import {character} from '../common/character';
import {Faction, FactionsHelper} from '../helpers/factions';
import {SkillsHelper} from '../helpers/skills';
import {Button} from './button';

interface IFactionSelectionProperties {
    onSelection: (faction: Faction) => void;
    onCancel: () => void;
    showOnlyNonHeritageFactions?: boolean;
    showSkills?: boolean;
    showCancel?: boolean;
    showOwnFaction?: boolean;
}

export class FactionSelection extends React.Component<IFactionSelectionProperties, {}> {
    constructor(props: IFactionSelectionProperties) {
        super(props);
    }

    render() {
        var factions = FactionsHelper.getFactions().map((f, i) => {
            if ((this.props.showOnlyNonHeritageFactions && f.needsHeritage) ||
                (f.id === character.faction && !this.props.showOwnFaction))    {
                return undefined;
            }

            const skills = this.props.showSkills
                ? f.skills.map((s, i) => {
                    return (<div key={i}>{SkillsHelper.getSkillName(s) }</div>)
                  })
                : undefined;

            return (
                <tr key={i}>
                    <td className="selection-header">{f.name}</td>
                    <td>{skills}</td>
                    <td><Button className="button-small" text="Select" onClick={() => { this.props.onSelection(f.id) } } /></td>
                </tr>
            )
        });

        const skillsHeader = this.props.showSkills ? (<h3>Skills</h3>) : undefined;

        const cancel = this.props.showCancel ? (<Button text="Cancel" className="button button-cancel" onClick={() => this.props.onCancel() }/>) : undefined;

        return (
            <div className="panel">
                <div className="header-text">SELECT FACTION</div>
                <br/>
                <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td>{skillsHeader}</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {factions}
                    </tbody>
                </table>
                {cancel}
            </div>
        );
    }
}