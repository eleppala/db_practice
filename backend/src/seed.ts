import pool from "./db";

const seed = async () => {
    // Clear existing data (reverse order due to foreign keys)
    await pool.query("DELETE FROM stat");
    await pool.query("DELETE FROM game");
    await pool.query("DELETE FROM player");
    await pool.query("DELETE FROM team");

    // Reset id sequences
    await pool.query("ALTER SEQUENCE team_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE player_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE game_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE stat_id_seq RESTART WITH 1");

    // Teams
    const { rows: teams } = await pool.query(`
        INSERT INTO team (name, city, founded_year) VALUES
        ('Jokerit', 'Helsinki', 1999),
        ('Tappara', 'Tampere', 1999),
        ('TPS', 'Turku', 1999),
        ('Kärpät', 'Oulu', 1999),
        ('K-Espoo', 'Espoo', 1999),
        ('Jyp', 'Jyväskylä', 1999)
        RETURNING id
    `);

    // Players (10 per team, same roster for each)
    const roster = [
        { first: 'firstname',  last: 'lastname',  pos: 'C',  jersey: 10, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'C',  jersey: 11, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'C',  jersey: 12, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'C',  jersey: 13, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'L',  jersey: 14, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'L',  jersey: 15, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'L',  jersey: 16, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'L',  jersey: 17, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'R',  jersey: 18, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'R',  jersey: 19, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'R',  jersey: 20, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'R',  jersey: 21, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'D',  jersey: 2, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'D',  jersey: 3, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'D',  jersey: 4, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'D',  jersey: 5, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'D',  jersey: 6, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'D',  jersey: 7, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'G',  jersey: 1, birth: '1990-01-01' },
        { first: 'firstname',  last: 'lastname',  pos: 'G',  jersey: 2, birth: '1990-01-01' },
    ];

    let playerCount = 0;
    for (const team of teams) {
        for (const p of roster) {
        await pool.query(
            "INSERT INTO player (name, position, jersey_number, team_id, birthdate) VALUES ($1, $2, $3, $4, $5)",
            [`${p.first} ${p.last}`, p.pos, p.jersey, team.id, p.birth]
        );
        playerCount++;
        }
    }

    // Games (each team plays 5 home games)
    const gameIds: number[] = [];
    const matchups = [
        [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
        [2, 1], [2, 3], [2, 4], [2, 5], [2, 6],
        [3, 1], [3, 2], [3, 4], [3, 5], [3, 6],
        [4, 1], [4, 2], [4, 3], [4, 5], [4, 6],
        [5, 1], [5, 2], [5, 3], [5, 4], [5, 6],
        [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
    ];

    for (let i = 0; i < matchups.length; i++) {
        const [home, away] = matchups[i];
        const month = String(9 + Math.floor(i / 10)).padStart(2, '0');
        const day = String((i % 28) + 1).padStart(2, '0');
        const homeScore = (i * 3) % 6;
        const awayScore = (i * 2) % 5;

        const { rows } = await pool.query(
        "INSERT INTO game (home_team_id, away_team_id, played_at, home_score, away_score) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [home, away, `2025-${month}-${day}T18:00:00`, homeScore, awayScore]
        );
        gameIds.push(rows[0].id);
    }

    // Stats (for each game, stats for players of both teams)
    let statCount = 0;
    for (const gameId of gameIds) {
        const { rows: gameData } = await pool.query(
        "SELECT home_team_id, away_team_id FROM game WHERE id = $1",
        [gameId]
        );
        const { home_team_id, away_team_id } = gameData[0];

        for (const teamId of [home_team_id, away_team_id]) {
        const { rows: teamPlayers } = await pool.query(
            "SELECT id, position FROM player WHERE team_id = $1",
            [teamId]
        );

        for (const player of teamPlayers) {
            const isGoalie = player.position === 'G';
            const goals = isGoalie ? 0 : (player.id + gameId) % 3;
            const assists = isGoalie ? 0 : (player.id + gameId + 1) % 3;
            const minutes = isGoalie ? 60 : 15 + (player.id % 10);

            await pool.query(
            "INSERT INTO stat (player_id, game_id, goals, assists, minutes_played) VALUES ($1, $2, $3, $4, $5)",
            [player.id, gameId, goals, assists, minutes]
            );
            statCount++;
        }
        }
    }

    console.log(`Seeded: ${teams.length} teams, ${playerCount} players, ${gameIds.length} games, ${statCount} stats`);
    await pool.end();
    };

    seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});