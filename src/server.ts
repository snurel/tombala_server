import { ConnectionManager } from './shared/managers/ConnectionManager';
import { GameManager } from './shared/managers/GameManager';
import { IOManager } from './shared/managers/IOManager';
import { TombalaConnectionManager } from './tombala/managers/TombalaConectionManager';
import { TombalaGameManager } from './tombala/managers/TombalaGameManager';

IOManager.init();
GameManager.init(new TombalaGameManager());
ConnectionManager.init(new TombalaConnectionManager());
