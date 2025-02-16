// =============================================================================
// AB_UtilForDoccano.js
// Version: 0.01
// -----------------------------------------------------------------------------
// Copyright (c) 2019 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビのノート
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================


/*:
 * @plugindesc v0.01 ユーティルプラグイン
 * @target MZ
 * @author ヱビ
 *
 * 
 * @param DefeatEnemyScoreVariable
 * @type variable
 * @desc 敵を倒したときにスコアを加算する変数のＩＤ
 * @default 0
 * 
 * 
 * @param DefeatEnemyScore
 * @type text
 * @desc 敵を倒したときに加算するスコア
 * @default enemy.mhp / 2
 * 
 * @help
 * ============================================================================
 * どんなプラグイン？
 * ============================================================================
 * 
 * 
 * 
 * ============================================================================
 * 機能
 * ============================================================================
 * 
 * 
 * 敵を倒したときに特定の変数にスコアを加算する。
 * 【没】「防御」を非表示にする。
 * 装備画面の魔防と運を消す。
 * ダメージポップアップを毎回削除する。
 * セーブデータを削減する。
 * 
 * ステートのメモ：
 * <element:x>
 * このステートを持つアクター/敵キャラのすべての攻撃スキルにID:xの属性を加える。
 * 
 * ============================================================================
 * 更新履歴
 * ============================================================================
 * 
 * Version 0.01
 *   
 * 
 * ============================================================================
 * 利用規約
 * ============================================================================
 * 
 * ・MITライセンスです。
 * ・クレジット表記は不要
 * ・営利目的で使用可
 * ・ソースコードのライセンス表示以外は改変可
 * ・素材だけの再配布も可
 * ・アダルトゲーム、残酷なゲームでの使用も可
 * 
 * 
 */ 
 
(function() {
	var parameters = PluginManager.parameters('ABMZ_UtilForDoccano');
	var DefeatEnemyScoreVariable = Number(parameters["DefeatEnemyScoreVariable"]);
	var DefeatEnemyScore = String(parameters["DefeatEnemyScore"]);



//=============================================================================
// 装備シーンでコマンドウィンドウ（最強装備など）を抜く
//=============================================================================
// 装備が装備できないバグが発生することがあるのでコメントアウト
/*
Scene_Equip.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_EquipCommand(rect);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this.addWindow(this._commandWindow);
    this._commandWindow.deselect();
};

Scene_Equip.prototype.slotWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const wx = this.statusWidth();
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth - this.statusWidth();
    const wh = this.mainAreaHeight()
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.createSlotWindow = function() {
    const rect = this.slotWindowRect();
    this._slotWindow = new Window_EquipSlot(rect);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setStatusWindow(this._statusWindow);
    this._slotWindow.setHandler("ok", this.onSlotOk.bind(this));
    this._slotWindow.setHandler("cancel", this.popScene.bind(this));
    this._slotWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._slotWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._slotWindow);
    this._slotWindow.activate();
    this._slotWindow.select(0);
};


Scene_Equip.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this.hideItemWindow();
};
*/

//=============================================================================
// 必殺防御スキル表示
//=============================================================================


var _Window_ActorCommand_prototype_setup = Window_ActorCommand.prototype.setup;
Window_ActorCommand.prototype.setup = function(actor) {
	_Window_ActorCommand_prototype_setup.call(this, actor);
	if (!this._actor) return;
	if (this._actor.actorId() != $gameVariables.value(103)) return;
	$gameSwitches.setValue(41, true);
};

	var _Scene_Battle_prototype_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
	Scene_Battle.prototype.endCommandSelection = function(){
		_Scene_Battle_prototype_endCommandSelection.call(this);
		$gameScreen.erasePicture(30);
		$gameScreen.erasePicture(31);
	};
//=============================================================================
// 接近戦ステート/絡みつきステート/パワーサーブ
//=============================================================================

Game_Battler.prototype.stateCheck = function() {
	this.sekkinsenCheck();
	this.karamiCheck();
	this.PowerServeCheck();
};

Game_Battler.prototype.sekkinsenCheck = function() {
	if (!this.sekkinnsenUser) return;
	if (this.isStateAffected(6) && this.isActor()) {
		if (this.sekkinnsenUser.canMove() && this.sekkinnsenUser.hateTarget()._actorId == this._actorId) {
		} else {
		 	this.removeState(6);
    		BattleManager._logWindow.displayRemovedStates(this);
		}
	} else if (this.isStateAffected(6)) {
		if (!this.sekkinnsenUser.canMove()) {
			this.removeState(6);
    		BattleManager._logWindow.displayRemovedStates(this);
		}
	}
};
Game_Battler.prototype.karamiCheck = function() {
	if (!this.karamiUser) return;
	if (this.karamiUser && this.isStateAffected(36) && this.isActor()) {
		if (this.karamiUser.canMove() && this.karamiUser.hateTarget()._actorId == this._actorId) {
		} else {
		 	this.removeState(36);
    		BattleManager._logWindow.displayRemovedStates(this);
		}
	} else if (this.karamiUser && this.isStateAffected(36)) {
		if (!this.karamiUser.canMove()) {
			this.removeState(36);
    		BattleManager._logWindow.displayRemovedStates(this);
		}
	}
};


Game_Battler.prototype.PowerServeCheck = function() {
	if (!this.PowerServeUser) return;
	if (!this.isStateAffected(18)) return;
	if (this.PowerServeUser.hp <= 0) {
	 	this.removeState(18);
    	BattleManager._logWindow.displayRemovedStates(this);
	}
};


Game_Unit.prototype.stateCheck = function () {
	this.aliveMembers().forEach(member => member.stateCheck());
};

let __BattleManager_endAction = BattleManager.endAction;
BattleManager.endAction = function() {
    __BattleManager_endAction.call(this);
    $gameTroop.stateCheck();
    $gameParty.stateCheck();
};
const Game_Battler_prototype_onBattleEnd = Game_Battler.prototype.onBattleEnd;

Game_Battler.prototype.onBattleEnd = function() {
	Game_Battler_prototype_onBattleEnd.call(this);
    this.sekkinnsenUser = null;
    this.karamiUser = null;
};

//=============================================================================
// AB_X_HateRowがない時の対策
//=============================================================================
if (!Game_Troop.prototype.rowTarget) {
	Game_Troop.prototype.clearFormation = function() {
		
	};
	Game_Troop.prototype.resetFormation = function() {
		
	};
	Game_Enemy.prototype.rowTarget = function() {
		return this.hateTarget();
	};
}
/*
Sprite_Actor.prototype.setupDamagePopup = function() {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            var sprite = new Sprite_Damage();
                sprite.x   = this.x - 65;
                sprite.y   = this.y - 40;
						
            sprite.setup(this._battler);
            this._damages.push(sprite);
            SceneManager._scene._spriteset._effectsContainer.addChild(sprite);
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
};
*/
//=============================================================================
// ステータスウィンドウの位置
//=============================================================================


Scene_Battle.prototype.statusWindowX = function() {
    return this.statusWindowRect().x;
};

Scene_Battle.prototype.statusWindowRect = function() {
    const extra = 10;
    const ww = Graphics.boxWidth - 192;
    const wh = this.windowAreaHeight() + extra;
    const wx = /*this.isRightInputMode()*/false ? 0 : Graphics.boxWidth - ww;
    const wy = Graphics.boxHeight - wh + extra - 4;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.partyCommandWindowRect = function() {
    const ww = 192;
    const wh = this.windowAreaHeight();
    const wx = /*this.isRightInputMode()*/ false ? Graphics.boxWidth - ww : 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.actorCommandWindowRect = function() {
    const ww = 192;
    const wh = this.windowAreaHeight();
    const wx = /*this.isRightInputMode()*/ false ? Graphics.boxWidth - ww : 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

//=============================================================================
// 経験値計算
//=============================================================================
	Game_Actor.prototype.calcChangeLevelExp = function(levelDif) {
		const targetLevel = this._level + levelDif;
		return this.expForLevel(targetLevel) - this.expForLevel(this._level);
	};

//=============================================================================
// エンカウント率
//=============================================================================
Game_Player.prototype.makeEncounterCount = function() {
    const n = $gameMap.encounterStep();
    this._encounterCount = Math.ceil((Math.randomInt(n) + Math.randomInt(n) +Math.randomInt(n) +Math.randomInt(n) +Math.randomInt(n) +Math.randomInt(n))/3);
};
//=============================================================================
// 牽制攻撃用スコア計算
//=============================================================================
// 行動の対象キャラで関数を使う。
// 通常スコア：20
// 攻撃の場合：ダメージ/(自分の防御*2.5)（アクターの最大HP割合に近い）
// 失敗した場合：0
// デバフを与えた場合：+10
// ステートを与えた場合：
Game_Battler.prototype.calcActionScore = function() {
	let score = 20;
	const result = this._result;
	if (result.hpDamage > 0) {
		score = Math.floor(result.hpDamage / (this.def*2.5)*100);
	}
	if (!result.success) {
		score = 0;
	}
	if (result.addedDebuffs.length > 0) {
		score += 10;
	}
	var badStates = [5,6,7,8,10,11,12,16,17,45,49,69,70,71,72];
	stateLoop: for (let i=0, l=result.addedStates.length; i<l; i++) {
		for (let j=0, jl=badStates.length; j<jl; j++) {
			if (result.addedStates[i] == badStates[j]) {
				score += 10;
				break stateLoop;
			}
		}
	}
	return score;
};
var _Game_Battler_prototype_clearResult = Game_Battler.prototype.clearResult;
Game_Battler.prototype.clearResult = function() {
    this._actionScore = this.calcActionScore();
		_Game_Battler_prototype_clearResult.call(this);
};
Game_Battler.prototype.getLastActionScore = function() {
    return this._actionScore;
};


//=============================================================================
// ツクールMZの「敵が生存死亡無条件のスキルを使うと効果が発動しない」バグ修正。
//=============================================================================

var _Game_Action_prototype_targetsForDeadAndAlive = Game_Action.prototype.targetsForDeadAndAlive;
Game_Action.prototype.targetsForDeadAndAlive = function(unit) {
		if (this.isForOne() && this._targetIndex < 0) {
			return [unit.randomAliveAndDeadTarget()];
		}
		return _Game_Action_prototype_targetsForDeadAndAlive.call(this, unit);
};

Game_Unit.prototype.randomAliveAndDeadTarget = function() {
    const members = this.members();
    return members.length ? members[Math.randomInt(members.length)] : null;
};

//=============================================================================
// ルーンファクトリー型MP消費（MPが足りないとHPを25%消費する）
//=============================================================================

/*
var _Game_BattlerBase_prototype_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
Game_BattlerBase.prototype.skillMpCost = function(skill) {
  var cost = _Game_BattlerBase_prototype_skillMpCost.call(this, skill);
//	if (this.isEnemy()) return cost;
	if (skill.damage.type == 3) return cost;
	if (cost > this.mmp) return cost;
	if (cost > this.mp) return this.mp;
  return cost;
};

var _Game_BattlerBase_prototype_skillHpCost = Game_BattlerBase.prototype.skillHpCost;
Game_BattlerBase.prototype.skillHpCost = function(skill) {
  var cost = _Game_BattlerBase_prototype_skillHpCost.call(this, skill);
//	if (this.isEnemy()) return cost;
	if (skill.damage.type == 3) return cost;
	var mpCost = _Game_BattlerBase_prototype_skillMpCost.call(this, skill);
	if (mpCost <= 0) return cost;
	if (mpCost > this.mmp) return cost;
	if (this.mp > 0) return cost;
	if (this.isEnemy() && this.hp < this.atk) return this.hp-1;
	if (this.isEnemy()) return this.atk;
	if (this.currentAction() && this.currentAction()._forcing && this.hp < Math.floor(this.mhp / 4)) return this.hp-1;
	return Math.floor(this.mhp / 4);
};
*/
//=============================================================================
// 攻撃後スイッチON
//=============================================================================
var _BattleManager_endAction  = BattleManager.endAction;
BattleManager.endAction = function() {
		_BattleManager_endAction.call(this);
		$gameSwitches.setValue(33,true);
};
//=============================================================================
// 戦闘中「予知夢」スイッチがONならもやもやスクリーンを映す
//=============================================================================
var _Scene_Battle_prototype_start  = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
    _Scene_Battle_prototype_start.call(this);
		if ($gameSwitches.value(9)) {
			$gameScreen.showPicture(99, "MoyaMoyaScreen", 0, 0, 0, 100,100, 100, 0);
			$gameScreen.showPicture(100, "WhiteScreen", 0, 0, 0, 100,100, 100, 0);
		}
};

//=============================================================================
// 敵キャラを倒したとき、お金が溜まるようにする
//=============================================================================


Game_Enemy.prototype.gold = function() {
    return Math.ceil(this.mhp/20);
};


//=============================================================================
// 属性倍率。複数属性の場合のはずだったけど、没
//=============================================================================

/* 属性倍率 */
/*
Game_Battler.prototype.additionalElements = function () {
	var elements = [];
	var states = this.states();
	for (var i = 0, l = states.length; i<l; i++) {
		if (states[i].meta.element) {
			elements.push(Number(states[i].meta.element));
		}
	}
	elements.filter(Yanfly.Util.onlyUnique);
	return elements;
};

// 注：上書き
Game_Action.prototype.calcElementRate = function(target) {
		var elements = this.subject().additionalElements();
    if (this.item().damage.elementId < 0) {
        elements = elements.concat(this.subject().attackElements());
    } else {
        elements = elements.concat(this.item().damage.elementId);
    }
		elements.filter(Yanfly.Util.onlyUnique);
		return this.elementsMaxRate(target, elements);
};/*
var _Game_Action_prototype_calcElementRate = Game_Action.prototype.calcElementRate;
Game_Action.prototype.calcElementRate = function(target) {
	return _Game_Action_prototype_calcElementRate.call(this, target);
};

Game_Action.prototype.calcAdditionalElementRate = function() {
	return;
};
*/


//=============================================================================
// 防御コマンド、アイテムコマンドを抜く
//=============================================================================
/*
Window_ActorCommand.prototype.addGuardCommand = function() {
    //this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
};
Window_ActorCommand.prototype.addItemCommand = function() {
	if (!this._actor.canUseItemInBattle()) return false;
    this.addCommand(TextManager.item, "item");
};

Game_Actor.prototype.canUseItemInBattle = function() {
	const equips = this.equips();
	for (let i = 0, l = equips.length; i < l; i++) {
		if (equips[i] && equips[i].meta.アイテムポーチ) return true;
	};
	return false;
};
*/

//=============================================================================
// 防御コマンドを抜き、アイテムコマンドを誰も狙われていないときだけ使用可能にする
//=============================================================================
/*
Window_ActorCommand.prototype.addGuardCommand = function() {
    //this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
};
*/
Window_ActorCommand.prototype.addItemCommand = function() {
	let canUse = this._actor.canUseItemInBattle();
    this.addCommand(TextManager.item, "item", canUse);
};

// 狙われているとアイテム使用できないようにしていたが削除
Game_Actor.prototype.canUseItemInBattle = function() {
	//if (this.whoHateMe().length > 0) return false;
	return true;
};
//=============================================================================
// レベルアップで能力値上昇を表示
//=============================================================================


var _Game_Actor_prototype_changeExp = Game_Actor.prototype.changeExp;
Game_Actor.prototype.changeExp = function(exp, show) {
		const lastLevel = this._level;
		let params = [];
		for (var i=0; i<8; i++) {
			params[i] = -this.param(i);
		}
		
		_Game_Actor_prototype_changeExp.call(this, exp, show);
		for (var i=0; i<8; i++) {
			params[i] += this.param(i);
		}
		if (show) {
			this.displayParamUp(params);
		}
};

Game_Actor.prototype.displayParamUp = function(params) {
	for (var i=0; i<8; i++) {
		//if (i == 5) continue;
		if (params[i] > 0) {
			let text = "%1が %2 上がった！";
			text = text.format(TextManager.param(i), params[i]);
			$gameMessage.add(text);
		}/*
		if (params[i] < 0) {
			let text = "%1が %2 下がった！";
			text = text.format(TextManager.param(i), -params[i]);
			$gameMessage.add(text);
		}*/
	}
}
// 上書き
var _Game_Actor_prototype_displayLevelUp = Game_Actor.prototype.displayLevelUp;
Game_Actor.prototype.displayLevelUp = function(newSkills) {
	//_Game_Actor_prototype_displayLevelUp.call(this, newSkills);
	
    const text = TextManager.levelUp.format(
        this._name,
        TextManager.level,
        this._level,
				this.currentClass().name
    );
    $gameMessage.newPage();
    $gameMessage.add(text);
    for (const skill of newSkills) {
        $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    }
};



//=============================================================================
// HPが40%以上減るダメージを受けた時、バランス崩し（stateId:21）になる
//=============================================================================
/* 必殺防御が決まりづらくなるため削除
   また追加 また削除
var Game_Battler_prototype_gainHp = Game_Battler.prototype.gainHp;

Game_Battler.prototype.gainHp = function(value) {
		Game_Battler_prototype_gainHp.call(this, value);
		if (value * -1 >= this.mhp * 0.4 && $gameParty.inBattle() && !this.isDead()) {
			
			this.addState(21);
    		BattleManager._logWindow.displayAddedStates(this);
		}
};
*/


//=============================================================================
// 天候をピクチャより上に
//=============================================================================
Spriteset_Map.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createParallax();
    this.createTilemap();
    this.createCharacters();
    this.createShadow();
    this.createDestination();
    //this.createWeather();
};
var Spriteset_Map_prototype_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function() {
    this.createWeather();
    Spriteset_Map_prototype_createUpperLayer.call(this);
};
//=============================================================================
// 時間プラグインのエフェクトの時間を長めに
//=============================================================================

    Game_Chronus.prototype.getEffectDuration = function() {
        return 60;
				if (this.isRealTime()) {
            return 600;
        }
        return this._timeAutoAdd === 0 ? 1 : Math.floor(60 * 5 / (this.getRealAddSpeed() / 10));
    };

//=============================================================================
// 効果はバツグンだ！
//=============================================================================
var _Game_ActionResult_prototype_clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function() {
	_Game_ActionResult_prototype_clear.call(this);
	this.noEffect = false;
	this.weak = false;
	this.resist = false;
};
var _Game_Action_calcElementRate      = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        var result = _Game_Action_calcElementRate.apply(this, arguments);
        //if (BattleManager.isInputting()) return result;
        if (result === 0) {
			target.result().noEffect = true;
        } else if (result >= 101 / 100) {
			target.result().weak = true;
        } else if (result <= 99 / 100) {
			target.result().resist = true
        }
        
        if (result >= 101 / 100 && target.name() == "ルーク") {
        	$gameSwitches.setValue(93, true);
        }
        if (result >= 101 / 100 && target.name() == "エイゼル") {
        	$gameSwitches.setValue(94, true);
        }
        if (result >= 101 / 100 && target.name() == "ダイアナ") {
        	$gameSwitches.setValue(95, true);
        }
        return result;
    };

var _Window_BattleLog_prototype_displayHpDamage = Window_BattleLog.prototype.displayHpDamage;
Window_BattleLog.prototype.displayHpDamage = function(target) {
	// HP吸収攻撃を受けたときもダメージを受けたようにする
    if (target.result().hpDamage > 0 && target.result().drain) {
        this.push("performDamage", target);
    }
	_Window_BattleLog_prototype_displayHpDamage.call(this, target);
    if (target.result().hpAffected) {
		if (target.result().noEffect) this.push("addText", "効いている様子がない！");
		if (target.result().weak) this.push("addText", "弱点を突いた！");
		if (target.result().resist) this.push("addText", "効きづらいようだ……");
    }
};

//=============================================================================
// YEP_NAMEBOX
//=============================================================================


Window_Message.prototype.convertEscapeCharacters = function(text) {
    text = Window_Base.prototype.convertEscapeCharacters.call(this, text);
    text = this.convertNameBox(text);
    text = this.convertAgain(text);
    return text;
};

Window_Message.prototype.convertNameBox = function(text) {
		var self = this;/*
    text = text.replace(/\\/g, "\x1b");
    text = text.replace(/\x1b\x1b/g, "\\");*/
		text = text.replace(/\N\<(.*?)\>/gi, function() {
			//self._nameBoxWindow.openness = 255;
			$gameMessage.setSpeakerName(RegExp.$1);

			/*self._nameBoxWindow.setName(RegExp.$1);*/
			return "";
		});
		return text;

};

Window_Message.prototype.convertAgain = function(text) {
		var self = this;/*
    text = text.replace(/\\/g, "\x1b");
    text = text.replace(/\x1b\x1b/g, "\\");*/
		text = text.replace(/\\v\[(\d+)\]/gi, function() {
			//self._nameBoxWindow.openness = 255;
	
			/*self._nameBoxWindow.setName(RegExp.$1);*/
			return $gameVariables.value(RegExp.$1);
		});
		return text;

};

/*
var _Game_Enemy_prototype_performCollapse = Game_Enemy.prototype.performCollapse;
Game_Enemy.prototype.performCollapse = function() {
    _Game_Enemy_prototype_performCollapse.call(this);
		var actor = this._result.subject();
		if (!actor) return;
		if (!actor.isActor()) return;
		var vId = 0;
		switch(actor.name()) {
		  case "ルーク": vId = 78;break;
		  case "エイゼル": vId = 79;break;
		  case "ダイアナ": vId = 80;break;
		}
		$gameVariables.setValue(vId, $gameVariables.value(vId)+1);
		
};
*/
var _Game_Action_prototype_executeHpDamage = Game_Action.prototype.executeHpDamage;

Game_Action.prototype.executeHpDamage = function(target, value) {
		_Game_Action_prototype_executeHpDamage.call(this, target, value);
		if (!target.isActor()) {
			if (target.hp > 0) return;
			/*var enemy = target;
			var score = eval(DefeatEnemyScore);
			$gameVariables.setValue(DefeatEnemyScoreVariable, $gameVariables.value(DefeatEnemyScoreVariable)+score);
			$gameMessage.add("%1 のマナを獲得！".format(score));*/
			var actor = this.subject();
			if (!actor) return;
			if (!actor.isActor()) return;
			var vId = 0;
			switch(actor.name()) {
			  case "ルーク": vId = 78;break;
			  case "エイゼル": vId = 79;break;
			  case "ダイアナ": vId = 80;break;
			}
			$gameVariables.setValue(vId, $gameVariables.value(vId)+1);
			return;
		}
		var vId = 0;
		switch(target.name()) {
		case "ルーク": vId = 72;break;
		case "エイゼル": vId = 73;break;
		case "ダイアナ": vId = 74;break;}
		$gameVariables.setValue(vId, $gameVariables.value(vId)+1);
		// armordamage
		if (!target._armorHp) {
			target.initArmorHp();
		}
		target.armorDamage(1);
		if (target.hp <= 0) {
			switch(target.name()) {
				case "ルーク": vId = 62;break;
				case "エイゼル": vId = 63;break;
				case "ダイアナ": vId = 64;break;}
			$gameVariables.setValue(vId, $gameVariables.value(vId)+1);
		}

};

//=============================================================================
// ステートスプライトをフロントビューでも見れるようにする/敵キャラも表示
//=============================================================================
/*
var _Spriteset_Battle_prototype_createActors = Spriteset_Battle.prototype.createActors;
Spriteset_Battle.prototype.createActors = function() {
	_Spriteset_Battle_prototype_createActors.call(this);
    if (!$gameSystem.isSideView()) {
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            const sprite = new Sprite_Actor();
            this._actorSprites.push(sprite);
            this._battleField.addChild(sprite);
        }
    }
};
const _Sprite_Actor_createStateSprite = Sprite_Actor.prototype.createStateSprite;
Sprite_Actor.prototype.createStateSprite = function () {
    _Sprite_Actor_createStateSprite.apply(this);
    if (!$gameSystem.isSideView()) {
        this._stateSprite.visible = true;
    }
};

Sprite_Actor.prototype.damageOffsetX = function () {
    if ($gameSystem.isSideView()) {
        return upstream_Sprite_Actor_damageOffsetX.apply(this);
    } else {
        return 0;
    }
};

Sprite_Enemy.prototype.createStateSprite = function() {
    this._stateSprite = new Sprite_StateOverlay();
    this.addChild(this._stateSprite);
};
const _Sprite_Enemy_prototype_setBattler = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function(battler) {
	_Sprite_Enemy_prototype_setBattler.call(this, battler);
    this._stateSprite.setup(battler);
};
const Sprite_Enemy_prototype_initMembers = Sprite_Enemy.prototype.initMembers;
Sprite_Enemy.prototype.initMembers = function() {
	Sprite_Enemy_prototype_initMembers.call(this);
	this.createStateSprite();
};
*/
//=============================================================================
// DataManager
//=============================================================================
Game_Actor.prototype.isGetBattleSkills = function() {
    if (DataManager.isBattleTest()) return false;
    if ($gameTemp._disableBattleSkills) return false;
    if ($gameTemp._isDisplayRewards) return false;
    return $gameParty.inBattle();
};

Game_Enemy.prototype.exp = function() {
console.log("func exp called");
	return Math.ceil(Math.pow(this.mhp, 0.5) * (this.atk-25)/5);
};
BattleManager.displayMana = function() {//
		let mana = 0;
    for (const enemy of $gameTroop.deadMembers()) {
			var score = eval(DefeatEnemyScore);
			score = Math.floor(score);
      mana += score;
		}
		$gameMessage.add("%1 のマナを獲得！".format(mana));
		$gameVariables.setValue(DefeatEnemyScoreVariable, $gameVariables.value(DefeatEnemyScoreVariable)+mana);
		$gameVariables.setValue(132, $gameVariables.value(132)+mana);

};

var _BattleManager_displayRewards = BattleManager.displayRewards;
BattleManager.displayRewards = function() {
		_BattleManager_displayRewards.call(this);
    this.displayMana();
};

//=============================================================================
// YEP＿VictoryAfterMathで獲得マナを表示する（非表示）
//=============================================================================
BattleManager.makeRewards = function() {
    this._rewards = {
        gold: $gameTroop.goldTotal(),
        mana: $gameTroop.manaTotal(),
        exp: $gameTroop.expTotal(),
        items: $gameTroop.makeDropItems()
    };
};

let _BattleManager_gainRewards = BattleManager.gainRewards;
BattleManager.gainRewards = function() {
	_BattleManager_gainRewards.call(this);
    this.gainMana();
};
BattleManager.gainMana = function() {
	let mana = this._rewards.mana;
	$gameVariables.setValue(DefeatEnemyScoreVariable, $gameVariables.value(DefeatEnemyScoreVariable)+mana);
	$gameVariables.setValue(132, $gameVariables.value(132)+mana);
};

Game_Troop.prototype.manaTotal = function() {
	let mana = 0;
    for (const enemy of $gameTroop.deadMembers()) {
		var score = eval(DefeatEnemyScore);
		score = Math.floor(score);
    	mana += score;
	}
	return mana;
};

Window_VictoryDrop.prototype.makeItemList = function() {
    if (BattleManager._rewards.gold > 0) {
    	if (BattleManager._rewards.mana > 0) {
	      this._data = ['gold', 'mana'];
    	} else {
	      this._data = ['gold', null];
	    }
    } else {
    	if (BattleManager._rewards.mana > 0) {
	      //this._data = ['mana', null];
    	} else {
	      this._data = [];
	    }
    }
    this._dropItems = [];
    this._dropWeapons = [];
    this._dropArmors = [];
    this.extractDrops();
};
Window_VictoryDrop.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (!item) return;
    this.drawGold(item, index);
    //this.drawMana(item, index);
    this.drawDrop(item, index);
};
Window_VictoryDrop.prototype.drawMana = function(item, index) {
    if (item !== 'mana') return;
    var rect = this.itemRect(index);
    rect.width -= this.textPadding();
    var value = BattleManager._rewards.mana;
    var currency = "マナ";
    this.drawCurrencyValue(value, currency, rect.x, rect.y, rect.width);
};

//=============================================================================
// 他
//=============================================================================
	var _Game_Battler_prototype_onBattleEnd = Game_Battler.prototype.onBattleEnd;
	Game_Battler.prototype.onBattleEnd = function() {
		_Game_Battler_prototype_onBattleEnd.call(this);
		// actor._damagePopupが無限に増える現象を解消
		this._damagePopup = false;
		$gameSystem._enemyBookFlags = null;
		$gameSystem._enemyDropGot = null;
		// スキルツリーシステムで学んだスキルの情報をスキルカウントに統一
		
		if (this._stsLearnSkills) {
			this._stsLearnSkills = null;
			this._stsUsedCsp = null;
			this._stsUsedItem = null;
			this._stsUsedWeapon = null;
			this._stsUsedArmor = null;
			this._stsUsedVar = null;
			this._stsUsedGold = null;
		}
	};

	Game_System.prototype.addToEnemyBook = function(enemyId) {
		if (!this._defeatNumbers) {
			this.clearDefeatNumber();
		}
		if (this._defeatNumbers[enemyId]) {
			return;
		}
		this._defeatNumbers[enemyId] = 0;
	};

	
	Game_System.prototype.removeFromEnemyBook = function(enemyId) {
		if (this._defeatNumbers) {
			this._defeatNumbers[enemyId] = null;
		}
	};

	Game_System.prototype.completeEnemyBook = function() {
		this.clearEnemyBook();
		for (var i = 1; i < $dataEnemies.length; i++) {
			this.addToEnemyBook(i);
		}
	};

	Game_System.prototype.isInEnemyBook = function(enemy) {
		if (this._defeatNumbers && enemy) {
				if (this._defeatNumbers[enemy.id] === null) return false;
				if (this._defeatNumbers[enemy.id] === undefined) return false;
				return true;
		} else {
			return false;
		}
	};

	Game_System.prototype.setEnemyDropGot = function(eId, iId, value) {
		
	};

	Game_System.prototype.getEnemyDropGot = function(eId, iId) {
		
		return true;
	};

	Game_System.prototype.defeatNumber = function(id) {
		if (!this._defeatNumbers) {
			this.clearDefeatNumber();
		}
		if (!this._defeatNumbers[id]) {
			return 0;
		}
		return this._defeatNumbers[id];
	};

/*
	Window_StatCompare.prototype.refresh = function() {
	    this.contents.clear();
	    if (!this._actor) return;
			var lineHeight = 0;
	    for (var i = 0; i < 8; ++i) {
			if (i == 5) continue;
	        this.drawItem(0, lineHeight, i);
					lineHeight += this.lineHeight();
	    }
	};
*/
	Window_EquipStatus.prototype.refresh = function() {
	    this.contents.clear();
	    if (this._actor) {
					var n = 1;
	        this.drawActorName(this._actor, this.textPadding(), 0);
	        for (var i = 0; i < 8; i++) {
				if (i === 5 ) continue;
	            this.drawItem(0, this.lineHeight() * n, i);
							n++;
	        }
	    }
	};
// ????
/*
Window_EquipStatus.prototype.drawAllParams = function() {
		let y = this.paramY(0);
    for (let i = 0; i < 8; i++) {
		if (i==6 || i==7) continue;
        const x = this.itemPadding();
        this.drawItem(x, y, i);
        y += this.lineHeight();
    }
};
*/
var _Game_Actor_prototype_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
		_Game_Actor_prototype_levelUp.call(this);
		if (this.name() === "ルーク") {
			$gameVariables.setValue(203, $gameVariables.value(203)+1);
		}
		if (this.name() === "ダイアナ") {
			$gameVariables.setValue(204, $gameVariables.value(204)+1);
		}
		if (this.name() === "エイゼル") {
			$gameVariables.setValue(205, $gameVariables.value(205)+1);
		}
};
/*  */
if (false) {
	Window_ShopStatus.prototype.drawActorStatInfo = function(actor) {
	    this.contents.fontSize = Yanfly.Param.ShopStatFontSize;
	    var item1 = this.currentEquippedItem(actor, this._item.etypeId);
	    var canEquip = actor.canEquip(this._item);
			
	    for (var i = 0; i < 8; ++i) {
	      this.changePaintOpacity(true);
			//	if (i == 5) continue;
	      var rect = this.getRectPosition(i);
	      rect.x += this.textPadding();
	      rect.width -= this.textPadding() * 2;
	      this.changeTextColor(this.systemColor());
	      var text = TextManager.param(i);
	      this.drawText(text, rect.x, rect.y, rect.width);
	      if (!canEquip) this.drawActorCantEquip(actor, rect);
	      if (canEquip) this.drawActorChange(actor, rect, item1, i);
	    }
	    this.changePaintOpacity(true);
	};
	var _Scene_Shop_prototype_initialize = Scene_Shop.prototype.initialize;

Scene_Shop.prototype.initialize = function() {
    _Scene_Shop_prototype_initialize.call(this);
				var actors = $gameParty.members();
				for (var i=0,l=actors.length; i<l; i++) {
					var faceName = actors[i].actor().faceName;
			    var bitmap = ImageManager.loadFace(faceName);
				}
};
  var _Window_ShopCommand_makeCommandList = Window_ShopCommand.prototype.makeCommandList;
  Window_ShopCommand.prototype.makeCommandList = function() {
    if ($gameTemp.isGreedShop()) {
      this.addCommand($gameTemp.greedCommand(), 'buy');
      if (/*showSellCommand ||*/ !this._purchaseOnly) {
        this.addCommand(TextManager.sell, 'sell', !this._purchaseOnly);
      }
      this.addCommand(TextManager.equip, 'equip');
      this.addCommand(TextManager.cancel, 'cancel');
    } else {
      _Window_ShopCommand_makeCommandList.call(this);
    }
  };

  var _Scene_Shop_terminate = Scene_Shop.prototype.terminate;
  Scene_Shop.prototype.terminate = function() {
    _Scene_Shop_terminate.call(this);
		if (this._commandWindow.currentSymbol() === 'equip') {
    	$gameTemp.setGreedShop(true);
		}
  };
/*
Scene_Shop.prototype.onActorOk = function() {
    this.onActorCommon();
    if (this._commandWindow.currentSymbol() === 'equip') {
			
      SceneManager.push(Scene_Equip);
  		$gameTemp.setGreedShop(true);
    }
};*/
}

Game_Switches.prototype.value = function(switchId) {
    return this._data[switchId] == 1;
};

Game_Switches.prototype.setValue = function(switchId, value) {
    if (switchId > 0 && switchId < $dataSystem.switches.length) {
				if (value) {
					value = 1;
				} else {
					value = 0;
				}
        this._data[switchId] = value;
        this.onChange();
    }
};

Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
    return false;
};


// =============
// YEP_X_VisualHpGauge.js
// =============
//　ゲームエネミーのHPを全員見せて、セーブデータを軽くする
Game_System.prototype.initShownHpGauge = function() {
    //this._shownHpGauge = [];
};

Game_System.prototype.showHpGaugeEnemy = function(id) {
		return true;
    /*if (this._shownHpGauge === undefined) this.initShownHpGauge();
		if (!eval(Yanfly.Param.VHGDefeatFirst)) return true;
		return this._shownHpGauge.contains(id);;*/
};

Game_System.prototype.addHpGaugeEnemy = function(id) {
		return;
    if (this._shownHpGauge === undefined) this.initShownHpGauge();
		if (this._shownHpGauge.contains(id)) return;
		this._shownHpGauge.push(id);

}

Scene_Battle.prototype.onSkillOk = function() {
    const skill = this._skillWindow.item();
    const action = BattleManager.inputtingAction();
		if (!action) return;
    action.setSkill(skill.id);
    BattleManager.actor().setLastBattleSkill(skill);
    this.onSelectAction();
};

// 装備している防具のHP

Game_Actor.prototype.armorHP = function() {
	if (! this._armorHp) this._armorHp = 0;
	return this._armorHp;
}

Game_Actor.prototype.initArmorHp = function() {
	if (!this.hasArmor(this.armors()[0])) {
		this._armorHp = 0;
		return;
	}
	if (this.armors()[0].meta.ARMOR_HP) {
		const armorHp = this.armors()[0].meta.ARMOR_HP;
		this._armorHp = armorHp;
	} else {
		this._armorHp = 0;
	}
}
Game_Actor.prototype.initArmorTurn = function() {
	if (!this.hasArmor(this.armors()[0])) {
		this._armorHp = 0;
		return;
	}
	if (this.armors()[0].meta.ARMOR_Turn) {
		const armorTurn = this.armors()[0].meta.ARMOR_Turn;
		this._armorTurn = armorTurn;
	} else {
		this._armorTurn = 0;
	}
}


Game_Actor.prototype.armorDamage = function (damage) {
	if(this._armorHp <= 0) {
		return;
	}
	this._armorHp -= damage;
	
	if (this._armorHp <= 0) {
		$gameMessage.add(this.name() + "の" + this.armors()[0].name + "が壊れてしまった！");
		this._equips[1].setObject(null);
	}
}

Game_Actor.prototype.armorTurnEnd = function(){
	if (this._armorTurn <= 0) {
		return;
	}
	this._armorTurn -= 1;
	if (this._armorTurn <= 0) {
		$gameMessage.add(this.name() + "の" + this.armors()[0].name + "が壊れてしまった！");
		this._equips[1].setObject(null);
	}
}
var _Game_Battler_prototype_onTurnEnd = Game_Battler.prototype.onTurnEnd;
	 Game_Actor.prototype.onTurnEnd = function() {
		_Game_Battler_prototype_onTurnEnd.call(this);
		this.armorTurnEnd();
	};

var _Game_Actor_prototype_changeEquip = Game_Actor.prototype.changeEquip;
Game_Actor.prototype.changeEquip = function(slotId, item) {

	_Game_Actor_prototype_changeEquip.call(this, slotId, item);
	if (slotId == 1 && item) {
		this.initArmorHp();
		this.initArmorTurn();
	}
};

//=============================================================================
// MP回復で、経験値アップ（没）
//=============================================================================
/*
var Game_Battler_prototype_gainMp = Game_Battler.prototype.gainMp;
Game_Battler.prototype.gainMp = function(value) {
	if (this.isActor()) {
		let mpHeal = Math.min(value, this.mmp - this.mp)
    	this.changeExp(this._exp[this._classId] + mpHeal, true);
	}
	Game_Battler_prototype_gainMp.call(this, value);
};
*/

//=============================================================================
// 経験値ゲットで、魔法防御を非表示にする　うまくいかない。
//=============================================================================
/*
BattleManager.prepareVictoryPreLevel = function() {
    var length = $gameParty.allMembers().length;
    this._leveledActors = [];
    for (var i = 0; i < length; ++i) {
      var actor = $gameParty.allMembers()[i];
      if (!actor) continue;
      actor._preVictoryLv = actor._level;
      actor._preVictoryParams = [];
      actor._preVictoryParams.push(actor.mhp);
      actor._preVictoryParams.push(actor.mmp);
      actor._preVictoryParams.push(actor.atk);
      actor._preVictoryParams.push(actor.def);
      actor._preVictoryParams.push(actor.mat);
      //actor._preVictoryParams.push(actor.mdf);
      actor._preVictoryParams.push(actor.agi);
      actor._preVictoryParams.push(actor.luk);
    }
};

BattleManager.prepareVictoryPostLevel = function() {
    var length = $gameParty.allMembers().length;
    for (var i = 0; i < length; ++i) {
      var actor = $gameParty.allMembers()[i];
      if (!actor) continue;
      if (actor._preVictoryLv === actor._level) continue;
      this._leveledActors.push(actor);
      actor._postVictoryParams = [];
      actor._postVictoryParams.push(actor.mhp);
      actor._postVictoryParams.push(actor.mmp);
      actor._postVictoryParams.push(actor.atk);
      actor._postVictoryParams.push(actor.def);
      actor._postVictoryParams.push(actor.mat);
      //actor._postVictoryParams.push(actor.mdf);
      actor._postVictoryParams.push(actor.agi);
      actor._postVictoryParams.push(actor.luk);
    }
};


Window_VictoryLevelUp.prototype.drawCurrentParam = function(index, rect) {
    var x = rect.width - this.textPadding() + rect.x;
    var y = rect.y;
    x -= this._paramValueWidth * 2 + this._arrowWidth + this._bonusValueWidth;
    this.resetTextColor();
    if (index === 0) {
      var text = Yanfly.Util.toGroup(this._actor._preVictoryLv);
    } else if (index > 6) {
      var text = Yanfly.Util.toGroup(this._actor._preVictoryParams[index]);
    } else {
      var text = Yanfly.Util.toGroup(this._actor._preVictoryParams[index - 1]);
    }
    this.drawText(text, x, y, this._paramValueWidth, 'right');
};

Window_VictoryLevelUp.prototype.drawNewParam = function(index, rect) {
    var x = rect.width - this.textPadding() + rect.x;
    x -= this._paramValueWidth + this._bonusValueWidth;
    var y = rect.y;
    if (index === 0) {
      var newValue = this._actor.level;
      var diffvalue = newValue - this._actor._preVictoryLv;
    } else if (index > 5) {
      var text = Yanfly.Util.toGroup(this._actor._preVictoryParams[index]);
    } else {
      var newValue = this._actor._postVictoryParams[index - 1];
      var diffvalue = newValue - this._actor._preVictoryParams[index - 1];
    }
    var text = Yanfly.Util.toGroup(newValue);
    this.changeTextColor(ColorManager.paramchangeTextColor(diffvalue));
    this.drawText(text, x, y, this._paramValueWidth, 'right');
};


Window_VictoryLevelUp.prototype.drawStatChanges = function() {
    this.contents.fontSize = Yanfly.Param.ALUFontSize;
    for (var i = 0; i < 7; ++i) {
      var rect = this.itemRect(i);
      this.drawRightArrow(rect);
      this.drawParamName(i, rect);
      this.drawCurrentParam(i, rect);
      this.drawNewParam(i, rect);
      this.drawParamDifference(i, rect);
    }

Window_VictoryLevelUp.prototype.drawDarkRects = function() {
    for (var i = 0; i < 7; ++i) {
      var rect = this.itemRect(i);

      this.drawDarkRect(rect.x, rect.y, rect.width, rect.height);
    }
};

Window_VictoryLevelUp.prototype.itemRect = function(index) {
  var rect = new Rectangle();
  rect.x = Yanfly.Param.ALUSkillWidth + this.standardPadding() * 2;
  rect.y = index * this.lineHeight();
	if (i >= 5) rect.y = (index -1) *this.lineHeight();
  rect.width = this.contents.width;
  rect.width -= this.widthArea() * 2;
  rect.height = this.lineHeight();
  return rect;
};

Window_VictoryLevelUp.prototype.drawParamName = function(index, rect) {
    var x = rect.x + this.textPadding();
    var y = rect.y;
    if (index === 0) {
      var text = TextManager.level;
    } else if (index >= 5){
		var text = TextManager.param(index -1);
    } else {
      var text = TextManager.param(index);
    }
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(text, x, y, this._paramNameWidth);
};

};

*/
// 最大のバトルメンバーを3人にする。
Game_Party.prototype.maxBattleMembers = function() {
    return 3;
};
// ステータス比較ウィンドウの、
// 最大PPと、魔法防御を消す
Window_EquipStatus.prototype.drawAllParams = function() {
    for (let i = 0; i < 8; i++) {
        const x = this.itemPadding();
        let y = this.paramY(i);
        if (i >= 1) {
			y = this.paramY(i-1);
		}
		if (i == 1) {
			continue;
		}
		if (i == 5) {
			continue;
		}
        if (i >= 5) {
			y = this.paramY(i-2);
		}
        this.drawItem(x, y, i);
    }
};

/*
Window_EquipStatusForUpgrade.prototype.paramY = function(index) {
    //const faceHeight = ImageManager.faceHeight;
    if (index >= 6) return Math.floor(this.lineHeight() * (index +1 + 1.5));
    return Math.floor(this.lineHeight() * (index + 1.5));
};

Window_EquipStatus.prototype.drawItem = function(x, y, paramId) {
    const paramX = this.paramX();
    const paramWidth = this.paramWidth();
    const rightArrowWidth = this.rightArrowWidth();
    this.drawParamName(x, y, paramId);
    if (this._actor) {
        this.drawCurrentParam(paramX, y, paramId);
    }
    this.drawRightArrow(paramX + paramWidth, y);
    if (this._tempActor) {
        this.drawNewParam(paramX + paramWidth + rightArrowWidth, y, paramId);
    }
};

Window_EquipStatus.prototype.drawParamName = function(x, y, paramId) {
    const width = this.paramX() - this.itemPadding() * 2;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(TextManager.param(paramId), x, y, width);
};
Window_EquipStatus.prototype.drawCurrentParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    this.resetTextColor();
    this.drawText(this._actor.param(paramId), x, y, paramWidth, "right");
};
*/


//=============================================================================
// 武器・防具のタグで条件付きにする(canEquip)
//=============================================================================
let Game_BattlerBase_prototype_canEquip = Game_BattlerBase.prototype.canEquip;
Game_BattlerBase.prototype.canEquip = function(item) {
	let actor = this;
	let user = this;
	let a = this;
	let canEquip = Game_BattlerBase_prototype_canEquip.call(this, item);
	if (!canEquip) return false;
	if (item.meta.canEquip === undefined) return true;
	canEquip = eval (item.meta.canEquip);
	return canEquip;
}; 


})();
