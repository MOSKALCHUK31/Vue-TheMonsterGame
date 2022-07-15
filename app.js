function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth <= 0) {
                return {width: '0%'};
            }
            return {width: this.monsterHealth + '%'};
        },
        playerBarStyles() {
            if (this.myHealth <= 0) {
                return {width: '0%'};
            }
            return {width: this.myHealth + '%'};
        },
        mayUserSpecialAttack() {
            return this.currentRound % 3 !== 0;
        }
    },
    data () {
        return {
            monsterHealth: 100,
            myHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: []
        }
    },
    watch: {
        monsterHealth(value) {
            if (value <= 0) {
                this.winner = 'player';
            } else if (value <= 0 && this.myHealth <= 0) {
                this.winner = 'draw';
            }
        },
        myHealth(value) {
            if (value <= 0) {
                this.winner = 'monster';
            } else if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            }
        }
    },
    methods: {
        onAttackMonster() {
            this.currentRound++;
            const damage = getRandomValue(5, 12);
            this.monsterHealth -= damage;
            this.addLogMess('player', 'attack', damage);
            this.attackPlayer();
        },
        attackPlayer() {
            const damage = getRandomValue(8, 15);
            this.myHealth -= damage;
            this.addLogMess('monster', 'attack', damage);
        },
        onSpecialAttackMonster() {
            this.currentRound++;
            const damage = getRandomValue(10, 25);
            this.monsterHealth -= damage;
            this.addLogMess('player', 'attack', damage);
            this.attackPlayer();
        },
        onHeal() {
            this.currentRound++;
            const healValue = getRandomValue(15, 20);

            if (this.myHealth + healValue > 100) 
                this.myHealth = 100;
            else 
                this.myHealth += healValue;

            this.addLogMess('player', 'heal', healValue);
            this.attackPlayer();
        },
        restartGame() {
            this.winner = null;
            this.myHealth = 100;
            this.monsterHealth = 100;
            currentRound = 0;
            this.logMessages = [];
        },
        onSurrender() {
            this.winner = 'monster';
        },
        addLogMess(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value 
            });
        }
    }
}).mount('#game');