import sqlite3
import json
from typing import List, Optional
from datetime import datetime
from models import LogEntry, Campaign, Target, Command

class DatabaseManager:
    def __init__(self, db_path: str = "social_commander.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize database tables"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    action TEXT NOT NULL,
                    target TEXT,
                    details TEXT NOT NULL,
                    type TEXT NOT NULL,
                    outcome TEXT NOT NULL,
                    probability REAL,
                    followback_chance REAL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS campaigns (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    codename TEXT NOT NULL,
                    status TEXT NOT NULL,
                    progress INTEGER NOT NULL,
                    time_remaining TEXT NOT NULL,
                    target INTEGER NOT NULL,
                    current INTEGER NOT NULL,
                    description TEXT NOT NULL,
                    completed_at TEXT,
                    verdict TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS targets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    bio TEXT NOT NULL,
                    location TEXT NOT NULL,
                    country TEXT NOT NULL,
                    continent TEXT NOT NULL,
                    strategy TEXT NOT NULL,
                    status TEXT NOT NULL,
                    followback_chance INTEGER NOT NULL,
                    story_dm_open TEXT NOT NULL,
                    tags_matched INTEGER NOT NULL,
                    total_tags INTEGER NOT NULL,
                    user_tags TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS commands (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    input TEXT NOT NULL,
                    output TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    success BOOLEAN NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    instagram_username TEXT,
                    session_token TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    expires_at DATETIME,
                    is_active BOOLEAN DEFAULT TRUE
                )
            """)
            
            conn.commit()
    
    def add_log_entry(self, log_entry: LogEntry) -> int:
        """Add a new log entry"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO logs (timestamp, action, target, details, type, outcome, probability, followback_chance)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                log_entry.timestamp,
                log_entry.action,
                log_entry.target,
                log_entry.details,
                log_entry.type,
                log_entry.outcome,
                log_entry.probability,
                log_entry.followbackChance
            ))
            return cursor.lastrowid
    
    def get_logs(self, limit: int = 100, log_type: Optional[str] = None) -> List[LogEntry]:
        """Get recent log entries"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            if log_type:
                cursor.execute("""
                    SELECT timestamp, action, target, details, type, outcome, probability, followback_chance
                    FROM logs WHERE type = ? ORDER BY created_at DESC LIMIT ?
                """, (log_type, limit))
            else:
                cursor.execute("""
                    SELECT timestamp, action, target, details, type, outcome, probability, followback_chance
                    FROM logs ORDER BY created_at DESC LIMIT ?
                """, (limit,))
            
            rows = cursor.fetchall()
            return [
                LogEntry(
                    timestamp=row[0],
                    action=row[1],
                    target=row[2],
                    details=row[3],
                    type=row[4],
                    outcome=row[5],
                    probability=row[6],
                    followbackChance=row[7]
                )
                for row in rows
            ]
    
    def add_campaign(self, campaign: Campaign) -> str:
        """Add a new campaign"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO campaigns 
                (id, name, codename, status, progress, time_remaining, target, current, description, completed_at, verdict, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            """, (
                campaign.id,
                campaign.name,
                campaign.codename,
                campaign.status,
                campaign.progress,
                campaign.timeRemaining,
                campaign.target,
                campaign.current,
                campaign.description,
                campaign.completedAt,
                campaign.verdict
            ))
            return campaign.id
    
    def get_campaigns(self) -> List[Campaign]:
        """Get all campaigns"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, name, codename, status, progress, time_remaining, target, current, description, completed_at, verdict
                FROM campaigns ORDER BY created_at DESC
            """)
            
            rows = cursor.fetchall()
            return [
                Campaign(
                    id=row[0],
                    name=row[1],
                    codename=row[2],
                    status=row[3],
                    progress=row[4],
                    timeRemaining=row[5],
                    target=row[6],
                    current=row[7],
                    description=row[8],
                    completedAt=row[9],
                    verdict=row[10]
                )
                for row in rows
            ]
    
    def add_target(self, target: Target) -> int:
        """Add a new target"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO targets 
                (username, bio, location, country, continent, strategy, status, followback_chance, story_dm_open, tags_matched, total_tags, user_tags, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            """, (
                target.username,
                target.bio,
                target.location,
                target.country,
                target.continent,
                target.strategy,
                target.status,
                target.followBackChance,
                target.storyDMOpen,
                target.tagsMatched,
                target.totalTags,
                json.dumps(target.userTags)
            ))
            return cursor.lastrowid
    
    def get_targets(self) -> List[Target]:
        """Get all targets"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT username, bio, location, country, continent, strategy, status, followback_chance, story_dm_open, tags_matched, total_tags, user_tags
                FROM targets ORDER BY created_at DESC
            """)
            
            rows = cursor.fetchall()
            return [
                Target(
                    username=row[0],
                    bio=row[1],
                    location=row[2],
                    country=row[3],
                    continent=row[4],
                    strategy=row[5],
                    status=row[6],
                    followBackChance=row[7],
                    storyDMOpen=row[8],
                    tagsMatched=row[9],
                    totalTags=row[10],
                    userTags=json.loads(row[11])
                )
                for row in rows
            ]
    
    def add_command(self, command: Command) -> int:
        """Add a new command"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO commands (input, output, timestamp, success)
                VALUES (?, ?, ?, ?)
            """, (
                command.input,
                command.output,
                command.timestamp,
                command.success
            ))
            return cursor.lastrowid
    
    def get_commands(self, limit: int = 50) -> List[Command]:
        """Get recent commands"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT input, output, timestamp, success
                FROM commands ORDER BY created_at DESC LIMIT ?
            """, (limit,))
            
            rows = cursor.fetchall()
            return [
                Command(
                    input=row[0],
                    output=row[1],
                    timestamp=row[2],
                    success=row[3]
                )
                for row in rows
            ]

def init_database(db_path: str = "social_commander.db") -> DatabaseManager:
    """Initialize and return database manager"""
    return DatabaseManager(db_path)
