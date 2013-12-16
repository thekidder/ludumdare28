var events = {};

function getDefaultEvents(money, lastMoney) {
  if(money < -game.maxDebt) {
    return [];
  } else if(money < 0) {
    return [getEvent('debt', {}, toMoneyFormat(game.maxDebt))];
  } else if(money < 10000) {
    return [getEvent('running_dry', {}, toMoneyFormat(money))];
  }
  return [getEvent('default')];
}

function addEvent(name, title, text) {
  events[name] = {
    title: doT.template(title),
    text: doT.template(text)
  };
}

function getEvent(name, titleObj, textObj) {
  return {
    title: events[name].title(titleObj),
    text: events[name].text(textObj)
  };
}

addEvent('default', 'A quiet month.', 'This is probably a good thing!');
addEvent('running_dry', 'Your Treasury is low!', 'You only have {{=it}} left! Try decreasing some costs.');
addEvent('debt', 'You are in debt!', 'You\'re borrowing money! If you are in debt by over {{=it}}, you will go bankrupt!');
addEvent('bishop_defect', 'Bishop Defects in {{=it}}!', '{{=it.bishop}} has defected from {{=it.religion}}! No good can come of this!');
