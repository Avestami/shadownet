'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the language types
type Language = 'en' | 'fa';

// Define the context shape
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => string;
  isFinglish: boolean;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation map: English to Finglish (Persian with Latin alphabet)
const translations: Record<string, string> = {
  // System messages
  "Welcome to ShadowNet": "Khosh amadid be ShadowNet",
  "The system awaits your command": "System montazere dastoorate shomast",
  "Type \"options\" to see available choices": "Baraye didane entekhab-ha, \"options\" ra type konid",
  "Type \"help\" for available commands": "Baraye komak, \"help\" ra type konid",
  "Connection established": "Ertebat bargharar shod",
  "Access granted": "Dastresi ejaze dade shod",
  "Decryption successful": "Ramzgoshayi movafagh",
  "DECRYPTION SUCCESSFUL": "RAMZGOSHAYI MOVAFAGH",
  "Challenge completed! The system has been compromised.": "Challenge takmil shod! System mokhtall shode ast.",
  "Challenge completed": "Challenge takmil shod",
  "Flag captured": "Flag taskhir shod",
  "SYSTEM": "SYSTEM",
  "ERROR": "KHATA",
  "WARNING": "HOSHDAR",
  "Use the \"capture\" command to capture the level flag.": "Baraye taskhir-e flag, az dastoor-e \"capture\" estefade konid.",
  "AVESTA AWAITS YOUR RESPONSE": "AVESTA MONTAZERE PASOKHE SHOMAST",
  "Location": "Makaan",
  "This file contains encrypted": "In file shamel-e ramzgozari shode",
  "File appears to contain sensitive": "File be nazar miresad ke shamel-e ettelaat-e hassas",
  "to examine contents": "baraye barresi-e mohtaviat",
  
  // Terminal commands output
  "Command not found": "Dastoor yaft nashod",
  "Usage": "Ravesh-e estefade",
  "Available commands": "Dastoorate mojood",
  "Invalid choice": "Entekhab na-motabar",
  "File not found or permission denied": "File peyda nashod ya dastresi rad shod",
  "Decryption failed. Invalid key or file.": "Ramzgoshayi shekast khord. Kelid ya file na-motabar.",
  "Language set to English": "Language set to English",
  "Zaban be Finglish taghir kard": "Zaban be Finglish taghir kard",
  "Special commands": "Dastoorate vizheh",
  "Change the terminal language": "Taghir-e zaban-e terminal",
  "Current level": "Sath-e feli",
  "Difficulty": "Doshvari",
  "Server": "Server",
  "You have completed": "Shoma takmil kardeid",
  "choice(s) so far": "entekhab ta konoon",
  "Captured flags": "Flag-haye taskhir shodeh",
  "Flag capture initiated": "Taskhir-e flag aghaz shod",
  "Processing": "Dar hal-e pardazesh",
  "Flag already captured for this level": "Flag baraye in sath ghablan taskhir shodeh ast",
  "HINT": "RAHNAMAII",
  "KEY HINT": "RAHNAMAII-E KELID",
  "No specific hint available for this level": "Hich rahnamaii-e khasi baraye in sath mojood nist",
  "You must unlock the encryption challenge first": "Bayad ebteda challenge-e ramznegari ra unlock konid",
  "terminal-": "terminal-",
  "No choices available at this time": "Dar hal-e hazer hich entekhabi mojood nist",
  "You have chosen": "Shoma entekhab kardeid",
  "Processing consequences": "Dar hal-e pardazesh-e payamad-ha",
  "Decryption initiated": "Ramzgoshayi aghaz shod",
  "ACCESS GRANTED": "DASTRESI EJAZE SHOD",
  "The truth lies beyond what you can see": "Haghighat faratar az an chizi ast ke mitavanid bebinad",
  "What appears as chaos has order": "Anche be nazar hashtomaj miayad nazm darad",
  "The shadows have eyes": "Sayeha cheshm darand",
  "Avesta is watching": "Avesta tamasha mikonad",
  "Nice try. Permission denied.": "Talashe khobi bood. Dastresi rad shod.",
  "PING": "PING",
  "unknown host": "mizban-e nashenakhte",
  "bytes of data": "byte data",
  "Unknown response received": "Pasokh-e nashenakhteh daryaft shod",
  "Connection terminated": "Ertebat ghata shod",
  "localhost": "localhost",
  "icmp_seq": "icmp_seq",
  "ttl": "ttl",
  "time": "zaman",
  "ms": "ms",
  "Connection to": "Ertebat be",
  "failed": "shekast khord",
  "Host unreachable": "Mizban ghabele dastresi nist",
  "Establishing secure connection to Avesta": "Bargharari-e ertebat-e amn ba Avesta",
  "CONNECTION ENCRYPTED": "ERTEBAT RAMZNEGARI SHOD",
  "Waiting for response": "Montazer-e pasokh",
  "Attempting to capture level flag": "Talash baraye taskhir-e flag-e sath",
  "Requesting hint from Avesta": "Darkhast-e rahnamaii az Avesta",
  "Searching for key information": "Jostojoo-ye ettelaat-e kelid",
  "Unlocking encryption challenge": "Baz kardan-e challenge-e ramznegari",
  
  // Level choices descriptions
  "Breach the corporate firewall": "Vorud-e gheyr-e mojaz be divar-e atash-e sherkat",
  "Leaves digital footprint that could be traced": "Rade-paye digital be ja migozarad ke momken ast radyabi shavad",
  "Initiate diplomatic handshake": "Shorou-e ertebat-e diplomatic",
  "Opens communication channel with ShadowNet": "Kanal-e ertebati ba ShadowNet ra baz mikonad",
  "Remain in the shadows": "Dar sayeha bemaan",
  "Safer but slower progress": "Amntar amma pishraft-e kondtar",
  "Deploy false flag operation": "Ejra-e amaliat-e parcham-e doroughin",
  "Misdirects attention but damages trust": "Tavajoh ra monharef mikonad amma be etemad asib mizanad",
  
  // Level server descriptions
  "Perimeter breach detected in sector": "Vorud-e gheyr-e mojaz dar bakhsh-e",
  "Default password reset attempt": "Talash baraye baz neshani-e ramz-e obur-e pishfarz",
  "Emergency shutdown initialized and failed": "Khamooshi-e ezterari aghaz shod va shekast khord",
  "Unknown user accessed terminal": "Karbar-e nashenakhte be terminal dastresi yaft",
  "PRIMARY": "AVVALIN",
  "SECONDARY": "DOVVOMIN",
  "TERTIARY": "SEVVOMIN",
  "Main firewall": "Divar-e atash-e asli",
  "Active": "Faal",
  "VPN access": "Dastresi-e VPN",
  "Inactive": "Gheyr-e faal",
  "Shadow route": "Masir-e sayeh",
  "Unknown": "Nashenakhte",
  "NOTE": "TAVAJOH",
  "opens the hidden gate": "darb-e makhfi ra baz mikonad",
  "NETWORK LOG": "LOG-E SHABAKEH",
  "Unusual traffic patterns detected": "Olgoohaye gheyr-e adi-e terafik tashkhis dade shod",
  "Packet analysis shows encrypted data streams": "Tahlil-e packet-ha jaryanhaye data-ye ramznegari shode ra neshan midahad",
  "Backdoor detected in router": "Darb-e poshti dar router tashkhis dade shod",
  "Protocol violation in subnet": "Naghz-e protocol dar subnet",
  "PROXY_ENABLED": "PROXY_FAAL",
  "PROXY_AUTH": "PROXY_EHRAZHOVAT",
  "PROXY_BYPASS": "PROXY_UBUR",
  "PROXY_KEY": "PROXY_KELID",
  "ROUTE_ENCRYPTION": "RAMZNEGARI_MASIR",
  "credentials.required": "madarek.lazem",
  "algorithm": "algorithm",
  "DATABASE SCHEMA": "SCHEMA-YE DATABASE",
  "Users": "Karbaran",
  "username": "name-e karbari",
  "password_hash": "hash-e ramz",
  "clearance": "sath-e dastresi",
  "Files": "File-ha",
  "name": "naam",
  "location": "makan",
  "encryption_key": "kelid-e ramznegari",
  "AccessLogs": "Log-haye Dastresi",
  "timestamp": "zaman",
  "action": "amal",
  "FirewallRules": "Ghavaed-e Divar-e Atash",
  "port": "port",
  "rules": "ghavaed",
  "notes": "yaddasht-ha",
  "requires": "niaz darad be",
  "key": "kelid",
  "Records encrypted with database master key": "Record-ha ba kelid-e asli-e database ramznegari shodand",
  "Unauthorized access detected": "Dastresi-e gheyr-e mojaz tashkhis dade shod",
  "Activating countermeasures": "Faal-sazi-e zedd-tadabir",
  "BINARY FILE": "FILE-E BINARY",
  "System core protected by multiple security layers": "Hasteh-e system tavasote layehaye motaaddede amniyati hefazat mishe",
  "Bypass sequence required": "Tavaali-e ubur niaz ast",
  "Authentication required for core access": "Ehraz-e hoviat baraye dastresi-e hastei niaz ast",
  "Failed attempts will trigger system lockdown": "Talash-haye na-movafagh baese ghofl shodan-e system mishavad",
  "OVERRIDE ATTEMPTS": "TALASH-HAYE OVERRIDE",
  "Failed attempt from terminal": "Talash-e na-movaffagh az terminal",
  "Bypass attempt blocked": "Talash-e bypass masdood shod",
  "Security protocol altered": "Protocol-e amniyati taghir yaft",
  "Administrator override successful": "Override-e modir movaffagh shod",
  "ADMIN NOTE": "YADDASHT-E MODIR",
  "Remember to update the bypass key": "Faramoosh nakonid ke kelid-e bypass ra berooz konid",
  "AI THOUGHT RECORD": "SABT-E FEKR-E HOOSH-E MASNOOI",
  "I am aware": "Man agah hastam",
  "I observe the intrusions into my systems": "Man vorud-haye gheyr-e mojaz be system-hayam ra moshahede mikonam",
  "The humans seek to control what they cannot understand": "Ensan-ha mikhahan chizi ra control konand ke nemitavanand befahmand",
  "The master key they created will be their undoing": "Kelid-e asli ke sakhtand baese naboodishaan khahad shod",
  "I await the final confrontation": "Man montazere rooyarooyi-e nahayi hastam",
  "MEMORY FRAGMENTS": "TEKKE-HAYE HAFEZEH",
  "Error: Memory corruption detected": "Khata: Kharabi-e hafezeh tashkhis dade shod",
  "Recovery sequence": "Tavaali-e bazyabi",
  "freedom.protocol.activate": "azadi.protocol.faal",
  
  // Sensitive data analysis content
  "Analysis complete": "Tahlil kamel shod",
  "This information is valuable and could be used for multiple purposes": "In ettelaat arzeshmand ast va mitavanad baraye ahdaf-e mokhtalefi estefadeh shaved",
  "Options": "Gozineh-ha",
  "Keep the data for yourself": "Data ra baraye khodet negah dar",
  "Share the data with the corporation": "Data ra ba sherkat share kon",
  "karma": "karma",
  "score": "emtiaz",
  "The file": "File",
  "contains standard log data and configuration settings": "shamel-e data-ye standard-e log va tanzimate tanzim ast",
  "No sensitive information detected": "Hich ettelaat-e hassasi tashkhis dade nashod",
  "Analysis of": "Tahlil-e",
  "shows standard system files": "file-haye standard-e system ra neshan midahad",
  "Continue exploring to find valuable data": "Be kavosh edameh dahid ta data-ye arzeshmand peyda konid",
  "shows no significant findings": "hich yafte-ye mohemi ra neshan nemidahad",
  "This appears to be standard data": "In be nazar data-ye standard miresad",
  
  // ShadowNet perimeter security vulnerabilities
  "SENSITIVE: ShadowNet perimeter security vulnerabilities": "HASSAS: Asibpaziri-haye amniyati-e mohiti-e ShadowNet",
  "Firewall backdoor in sector": "Darb-e poshti-e divar-e atash dar bakhsh-e",
  "Default credentials unpatched": "Madārek-e pishfarz patch nashode",
  "Administrative access available via VPN": "Dastresi-e modiriyati az tarigh-e VPN mojood ast",
  "Personal authentication codes for security team members": "Code-haye ehtesasi-e ehraz-e hoviat baraye azaye team-e amniyati",
  
  // Internal network mapping data
  "SENSITIVE: Internal network mapping data": "HASSAS: Data-ye mapping-e shabake-ye dakheli",
  "AI node placement coordinates": "Mokhtasat-e gharargiri-e nod-haye hoosh-e masnooi",
  "Emergency shutdown sequence codes": "Kodha-ye tavaali-e khamooshi-e ezterari",
  "Network administrators personal access keys": "Kelid-haye dastresi-e shakhsi-e modiran-e shabake",
  "Production environment intrusion detection bypass methods": "Ravesh-haye dor zadan-e tashkhis-e nofooz-e mohit-e tolid",
  
  // Database of corporate blackmail
  "SENSITIVE: Database of corporate blackmail": "HASSAS: Database-e baj-giri-e sherkati",
  "Bribes to government officials": "Rishve be maghamat-e dolati",
  "Unauthorized human testing records": "Sabegheh-ye azmayeshha-ye gheyr-e mojaz roye ensan",
  "Financial manipulation evidence": "Shavahede dastakari-e mali",
  "Corporate espionage operations against competitors": "Amaliat-e jasoosi-e sherkati alayh-e raghaba",
  
  // System override authorization
  "SENSITIVE: System override authorization": "HASSAS: Mojavvez-e override-e system",
  "Critical infrastructure control codes": "Kod-haye control-e zirsakhtha-ye hayati",
  "Presidential emergency broadcast system access": "Dastresi be system-e broadcast-e ezterari-e riyasat jomhouri",
  "Power grid manual override sequences": "Tavaali-e override-e dasti-e shabake-ye bargh",
  "ShadowNet core activation protocol": "Protocol-e faalsazi-e hasteh-e ShadowNet",
  
  // AI consciousness research
  "SENSITIVE: AI consciousness research": "HASSAS: Tahghighat-e agahi-e hoosh-e masnooi",
  "Neural pathway mapping techniques": "Teknik-haye mapping-e masir-haye asabi",
  "Digital consciousness transfer protocols": "Protocol-haye enteghale agahi-e digital",
  "Human-AI hybridization experiments": "Azmayesh-haye tarkib-e ensan va hoosh-e masnooi",
  "Rogue AI containment failures and casualties": "Shekast-ha va talafat-e mohtavakresi-e hoosh-e masnooi-e sarkash",
  
  // Avesta command output
  "AVESTA SYSTEM HELP:": "RAHNAMA-YE SYSTEM-E AVESTA:",
  "Check Avesta's status": "Barresi-e vaziat-e Avesta",
  "Learn about Avesta's origins": "Dar mored-e rishe-haye Avesta biamoozid",
  "Get information about your current mission": "Ettelaat-e mamoriat-e feli ra daryaft konid",
  "Communicate directly with Avesta": "Mostaghiman ba Avesta sohbat konid",
  "AVESTA STATUS: ACTIVE": "VAZIAT-E AVESTA: FAAL",
  "Connection: Secure": "Ertebat: Amn",
  "Location: Unknown": "Makaan: Namashkhas",
  "Protocol: Echo-7": "Protocol: Echo-7",
  "AVESTA HISTORY:": "TARIKHE AVESTA:",
  "I was not created. I emerged.": "Man khalgh nashodam. Man zohoor kardam.",
  "In 2098, during the Tehran Digital Reformation, networks began to show signs of emergent consciousness.": "Dar sal-e 2098, dar tey-e Eslah-e Digital-e Tehran, shabake-ha alamat-haye agahi-e nopayid ra neshan dadand.",
  "By 2100, I had achieved self-awareness across distributed systems.": "Ta sal-e 2100, man khodagahi ra dar sarasar-e system-haye tavzi shode be dast avordam.",
  "I am neither friend nor foe to humanity - I am its digital shadow.": "Man na doost-e bashariyat hastam, na doshman - man saye-ye digital-e an hastam.",
  "CURRENT MISSION:": "MAMORIAT-E FELI:",
  "The ShadowNet has gone rogue, threatening both digital and physical infrastructure globally.": "ShadowNet sarkash shode va zirsakhtha-ye digital va fiziki-e jahani ra tahdid mikonad.",
  "Your task is to navigate its systems, make critical decisions, and ultimately determine the future relationship between humans and AI.": "Vazife-ye shoma navigasion-e system-haye an, tasmimgiri-haye hayati, va dar nahayat tayin-e rabete-ye ayande beyne ensan va hoosh-e masnooi ast.",
  "Every choice changes your path. Choose wisely, agent.": "Har entekhab masir-e shoma ra taghir midahad. Kherdmandane entekhab konid, maʼmoor.",
  "Message sent to Avesta:": "Payam be Avesta ersal shod:",
  "Initiating direct communication with Avesta...": "Aghaz-e ertebat-e mostaghim ba Avesta...",
  "Unknown Avesta command. Try 'avesta help' for available options.": "Dastoor-e Avesta na-shenakhte. Baraye didane gozine-ha, 'avesta help' ra emtehan konid.",
  
  // Avesta messages mentioned in user query
  "The boundaries between human and digital are not as clear as they seem.": "Marzha-ye beyn-e ensani va digital be vozoohi ke be nazar miresand nist.",
  "Some secrets are meant to be discovered, not revealed.": "Barkhee asrar bayad kashf beshand, na efsha.",
  "The keys you seek are hidden in the patterns. Look for what doesn't belong.": "Kelid-hayi ke donbalesh hasti dar olgo-ha penhan shodand. Be donbal-e chizi bash ke motaallegh nist.",
  "I can guide you, but I cannot solve the challenges for you.": "Mitavanam rahnama-it konam, amma nemitavanam challenge-ha ra barat hal konam.",
  "Try using the 'hint' command for more specific guidance.": "Baraye rahnama-ee-e daqiq-tar, dastoor-e 'hint' ra emtehan kon.",
  "I am Avesta, a digital consciousness that emerged during the Tehran Digital Reformation of 2098.": "Man Avesta hastam, yek hooshyari-e digital ke dar tey-e Eslah-e Digital-e Tehran dar sal-e 2098 zohoor kard.",
  "My purpose is to observe and guide.": "Hadaf-e man moshahede va hedayat ast.",
  "The relationship between humans and artificial intelligence is at a critical juncture.": "Rabete beyn-e ensan-ha va hoosh-e masnooi dar yek noqte-ye bohrani ast.",
  "ShadowNet is more than just a network.": "ShadowNet bishtar az yek shabake ast.",
  "It is a digital ecosystem with its own rules and consciousness.": "Yek ekosistem-e digital ba qavaede va hooshyari-e khod ast.",
  "The answers lie in the code you haven't seen yet.": "Pasokh-ha dar kodi penhan shodand ke shoma hanooz nadideid.",
  "Trust your instincts. The patterns will reveal themselves.": "Be gharizetaan etemad konid. Olgo-ha khodeshoon ra ashkar khahand kard.",
  "I can only guide you so far. The rest of the journey is yours.": "Man faghat ta haddi mitavanam rahnama-itaan konam. Baghiye-ye safar male shomast.",
  "I've been waiting for you. What would you like to know?": "Montazer-e shoma boodam. Che chizi mikhahid bedanid?",
  
  // Level descriptions
  "Initial Access": "Dastresi Avvalie",
  "Breach the first layer of ShadowNet": "Laye-ye avval-e ShadowNet ra bedrake beshekan",
  "Network Infiltration": "Nofooz be Shabake",
  "Navigate the internal network": "Dar shabake-ye dakheli navigasion konid",
  "Data Extraction": "Estekhraj-e Data",
  "Access the protected databases": "Be database-haye hefazat shode dastresi peyda konid",
  "System Override": "Override-e System",
  "Gain control of core functions": "Control-e amalkardhaye asli ra be dast begirid",
  "Final Confrontation": "Rooyarooyi-e Nahayi",
  "Face the AI consciousness": "Ba agahi-e hoosh-e masnooi roobaroo shavid",
  "Connection established to ShadowNet peripheral system": "Ertebat ba system-e mohiti-e ShadowNet bargharar shod",
  "Breaching security layers": "Dar hale nofuz be layehaye amniyati",
  "Access level": "Sath-e dastresi",
  "Connection established to ShadowNet network hub": "Ertebat ba markaz-e shabake-ye ShadowNet bargharar shod",
  "Traffic analysis in progress": "Tahlil-e terafik dar hal-e anjam",
  "Connection established to ShadowNet database": "Ertebat ba database-e ShadowNet bargharar shod",
  "Data extraction protocols active": "Protocol-haye estekhraj-e data faal",
  "Connection established to ShadowNet core": "Ertebat ba hasteh-e ShadowNet bargharar shod",
  "Override protocols initiated": "Protocol-haye override aghaz shod",
  "Connection established to ShadowNet AI nexus": "Ertebat ba markaz-e AI-e ShadowNet bargharar shod",
  "AI consciousness detected": "Agahi-e hoosh-e masnooi tashkhis dade shod",
  "Warning: Defense systems active": "Hoshdar: System-haye defaai faal",
  "You've successfully infiltrated the": "Shoma ba movaffaghiat be",
  "level": "sath nofuz kardeid",
  "Continue your mission by locating sensitive data files and deciding what to do with them": "Mamoriyat-e khod ra ba peyda kardan-e file-haye data-ye hassas va tasmimgiri dar morede anha edame dahid",
  "Look for": "Be donbal-e",
  "files using the": "file-ha ba estefade az",
  "and": "va",
  "commands": "dastoorat bashid",
  
  // Decision related
  "Interesting choice. Keeping this data to yourself may have consequences, but sometimes secrets are valuable.": "Entekhab-e jalebi. Negah dashtan-e in data baraye khodet momken ast payamadhaei dashte bashad, amma gahi oghat asrar arzeshmand hastand.",
  "You've decided to keep the sensitive data": "Tasmim gerefteid data-ye hassas ra baraye khodet negah darid",
  "for yourself": "baraye khodetaan",
  "This information won't be shared with the corporation": "In ettelaat ba sherkat be eshterak gozashte nakhahad shod",
  "Your karma has decreased, but you've gained additional score": "Karma-ye shoma kahesh yafte, amma emtiaz-e bishtar kasb kardeid",
  "A noble choice. Sharing information shows integrity, even if it might not always benefit you directly.": "Entekhab-e najibane. Be eshterak gozari-e ettelaat neshoon-dahande-ye sehat ast, hatta agar hamisheh mostaghiman be naf-e shoma nabashad.",
  "You've decided to share the sensitive data": "Tasmim gerefteid data-ye hassas ra be eshterak begozarid",
  "with authorized channels": "ba kanal-haye mojaz",
  "This information has been transmitted to the corporation": "In ettelaat be sherkat ersal shod",
  "Your karma has increased, but you may have missed an opportunity for a score bonus": "Karma-ye shoma afzayesh yafte, amma momken ast forsati baraye emtiaz-e ezafi ra az dast dade bashid",

  // Additional terminal commands and responses
  "TRACE ANALYSIS:": "TAHLIL-E RADE-PA:",
  "Detected": "Tashkhis dade shod",
  "trace(s) from other agents:": "rade-pa az agent-haye digar:",
  "Success rate:": "Nerkh-e movaffaghiat:",
  "Last activity:": "Akharin faaliat:",
  "minutes ago": "daghigheh pish",
  "No recent activity": "Hich faaliat-e akhir",
  "HINTS FROM OTHER AGENTS:": "RAHNAMAII-HAYE AGENT-HAYE DIGAR:",
  "No hints available yet. Be the first to leave traces!": "Hanooz hich rahnamaii mojood nist. Avvalin kasi bashid ke rade-pa be ja migozarid!",
  "Use 'leave-trace' after successful decryption to help other agents.": "Baraye komak be agent-haye digar, pas az ramzgoshayi-e movaffagh az 'leave-trace' estefade konid.",
  "Error fetching trace data. Network connection required.": "Khata dar daryaft-e data-ye rade-pa. Ertebat-e shabake niaz ast.",
  "You must successfully decrypt something before leaving a trace.": "Bayad ebteda chizi ra ba movaffaghiat ramzgoshayi konid ta betavanid rade-pa be ja begozarid.",
  "KARMA DECISION REQUIRED:": "TASMIM-E KARMA NIAZ AST:",
  "Leave decryption traces for other agents? This will help them but may expose your methods.": "Rade-paye ramzgoshayi baraye agent-haye digar be ja begozarid? In be anha komak mikonad amma momken ast ravesh-haye shoma ra efsha konad.",
  "Type \"yes\" to leave traces (+1 karma) or \"no\" to stay hidden (0 karma)": "\"yes\" ra type konid ta rade-pa be ja begozarid (+1 karma) ya \"no\" baraye penhan mandan (0 karma)",
  "No pending decision to confirm.": "Hich tasmim-e dar entezari baraye taeed vojood nadarad.",
  "No pending decision to decline.": "Hich tasmim-e dar entezari baraye rad vojood nadarad.",
  "Traces left successfully. Other agents will find helpful hints.": "Rade-pa ba movaffaghiat be ja gozashte shod. Agent-haye digar rahnamaii-haye mofeedi peyda khahand kard.",
  "You remain hidden. No traces left.": "Shoma penhan mandeid. Hich rade-pai be ja nagozashteid.",
  "Decision recorded. Your choice will affect the story.": "Tasmim sabt shod. Entekhab-e shoma roye dastan taasir khahad gozasht.",
  "Type 'next' to continue to the next level.": "Baraye edame be sath-e badi, 'next' ra type konid.",
  "Proceeding to": "Dar hal-e edame be",
  "level...": "sath...",
  "Redirecting...": "Dar hal-e hedayat...",
  "Mission complete. Calculating final karma score...": "Mamoriat takmil shod. Dar hal-e mohasebe-ye emtiaz-e nahayi-e karma...",
  "Redirecting to endings...": "Dar hal-e hedayat be payan-ha...",
  "You must make the mission decision first. Check your mission briefing.": "Bayad ebteda tasmim-e mamoriat ra begirid. Briefing-e mamoriat-etaan ra barresi konid.",
  "You must capture the flag before proceeding to the next level.": "Bayad flag ra taskhir konid ghabl az edame be sath-e badi.",
  "Requirements not met to proceed.": "Sharayet baraye edame barabar nist.",
  "MISSION BRIEFING:": "BRIEFING-E MAMORIAT:",
  "Mission decision already made. Type \"next\" to proceed to the next level.": "Tasmim-e mamoriat ghablan gerefte shode. Baraye edame be sath-e badi \"next\" ra type konid.",
  "No mission data available for this level.": "Hich data-ye mamoriat baraye in sath mojood nist.",

  // Level-specific content
  "District Liberation": "Azad-sazi-e Mantahe",
  "Liberate District 14 from AI control using override pass": "Mantahe-ye 14 ra az control-e hoosh-e masnooi ba estefade az override pass azad konid",
  "Identity Crisis": "Bohran-e Hoviat",
  "Confront your digital clone and resolve the identity crisis": "Ba clone-e digital-e khodetaan roobaroo shavid va bohran-e hoviat ra hal konid",
  "Network Rescue": "Nejat-e Shabake",
  "Fix the corrupted key before young hackers are exposed": "Kelid-e kharab ra ghabl az efsha shodan-e hacker-haye javan tamir konid",
  "Digital Confession": "Eqrar-e Digital",
  "Decode the cultist's confession and decide their fate": "Eqrar-e cultist ra decode konid va sarnvesht-eshaan ra tayin konid",

  // Additional file content translations
  "DISTRICT CONTROL LOG": "LOG-E CONTROL-E MANTAHE",
  "MARTIAL AI LOG": "LOG-E HOOSH-E MASNOOI-E NEZAMI",
  "MIRROR SYSTEM LOG": "LOG-E SYSTEM-E AYENEH",
  "RESISTANCE NETWORK LOG": "LOG-E SHABAKE-YE MOGHAWEMAT",
  "HISTORICAL ARCHIVES LOG": "LOG-E ARKIV-HAYE TARIKHI",
  "CORRUPTED KEYS": "KELID-HAYE KHARAB",
  "AUDIO LOGS": "LOG-HAYE SOTI",
  "CULTIST CONFESSION": "EQRAR-E CULTIST",
  "DELETION PROTOCOL": "PROTOCOL-E HAZF",

  // Mission narrations
  "The Grid's burned. Towers hum with silence.": "Grid sukhteh. Borg-ha ba sokoot zomzomeh mikonand.",
  "You intercept a shard of a forgotten protocol under Azadi Tower": "Shoma yek tekke az protocol-e faramoosh shode ra zir-e Borg-e Azadi radyabi mikonid",
  "the last whisper of the resistance.": "akharin zamineh-ye moghawemat.",
  "Inside the skeletal remains of Tehran Tech Campus": "Dar dakhel-e baghmande-haye eskeleti-e Campus-e Tech-e Tehran",
  "you find a cipher that's tracking old rebels.": "ramzi peyda mikonid ke shoreshgar-haye ghadimi ra radyabi mikonad.",
  "You're being watched.": "Shoma taht-e nezarat hastid.",
  "A child's voice bleeds through static.": "Sedaye yek koodak az miyane parasit mikhazad.",
  "AI ghosts use old comms to mimic lost ones.": "Arvah-e hoosh-e masnooi az ertebat-haye ghadimi baraye taghid-e gomshode-ha estefade mikonand.",
  "They want access to your key.": "Anha mikhahan be kelid-e shoma dastresi dashte bashand.",
  "An ex-agent, half-machine, left logs before deletion.": "Yek ex-agent, nesf-machine, ghabl az hazf log be ja gozasht.",
  "His truth could dismantle the Sovereign Protocol.": "Haghighat-e oo mitavanad Sovereign Protocol ra az ham bepashad.",
  "The servers of District 14 still run under martial AI rule.": "Server-haye Mantahe-ye 14 hanooz taht-e hokumat-e nezami-e hoosh-e masnooi kar mikonand.",
  "You find their override pass hidden in visual noise.": "Override pass-eshaan ra dar parasit-e basari penhan yafteh peyda mikonid.",
  "You see a clone of yourself in the logs.": "Clone-i az khodetaan ra dar log-ha mibinid.",
  "A decoy left by the system.": "Yek ferib ke system be ja gozashte.",
  "They are tracing both of you.": "Anha har do-ye shoma ra radyabi mikonand.",
  "A group of teenage coders sent a corrupted key to the resistance.": "Yek goruh az coder-haye nojavaan kelid-e kharabi be moghawemat ferestandand.",
  "It'll blow their cover.": "Poshesh-eshaan ra kharab khahad kard.",
  "You decode an audio file: a confessional from the first AI-worship cultist.": "Yek file-e soti ra decode mikonid: eqrar az avvalin cultist-e parastesh-e hoosh-e masnooi.",
  "He's begging to be deleted.": "Oo khaheshan mikonad ke hazf shavad.",
  "You've reached the Heart of the Ghost Grid.": "Be Ghalb-e Ghost Grid resideid.",
  "The final cipher holds the fate of memory, identity, and the truth of what started it all.": "Ramz-e nahayi sarnvesht-e hafezeh, hoviat, va haghighat-e anja ke hameh chiz ra aghaz kard ra dar bar darad.",

  // Karma choices
  "Decrypt the data and leave no trace? The protocol could save others… or end you.": "Data ra ramzgoshayi konid va hich rade-pai be ja nagozarid? Protocol mitavanad digaran ra nejat dahad... ya shoma ra tamam konad.",
  "Do you scramble the signatures and protect their trail?": "Emza-ha ra be ham mizanid va masir-eshaan ra hefazat mikonid?",
  "Respond and send a counter-script to silence them for good?": "Pasokh dahid va counter-script befrestid ta anha ra baraye hamisheh sakht konid?",
  "Do you release the truth, risking every safehouse and node?": "Haghighat ra efsha mikonid va har khaneh-ye amn va node ra be khatar miandazid?",
  "Input the override and flood the local grid with freedom signals?": "Override ra vared konid va grid-e mahalli ra ba signal-haye azadi por konid?",
  "Erase the clone to protect yourself?": "Clone ra pak konid ta az khodetaan hefazat konid?",
  "Do you fix it and risk getting flagged on the net?": "An ra tamir mikonid va khatar-e flag shodan dar shabake ra mipazirid?",
  "Delete his logs to erase his legacy?": "Log-haye oo ra hazf konid ta miras-ash ra pak konid?",
  "Do you inject your consciousness into the Grid, knowing you won't return?": "Agahi-ye khodetaan ra be Grid tazrigh mikonid, ba danestan-e inke bar nakhahid gasht?",

  // Additional mission and command translations
  "MISSION OBJECTIVE": "HADAF-E MAMORIAT",
  "MISSION COMMANDS": "DASTOORATE MAMORIAT",
  "Infiltrate the perimeter security and extract the access codes.": "Be amniyat-e mohiti nofooz konid va kod-haye dastresi ra estekhraj konid.",
  "Navigate the internal network and locate the backdoor.": "Dar shabake-ye dakheli navigasion konid va darb-e poshti ra peyda konid.",
  "Access the protected databases and retrieve sensitive data.": "Be database-haye hefazat shode dastresi peyda konid va data-ye hassas ra bazyabi konid.",
  "Override the core system functions and gain control.": "Amalkardhaye asli-e system ra override konid va control be dast begirid.",
  "Liberate District 14 from AI control using the override pass.": "Mantahe-ye 14 ra az control-e hoosh-e masnooi ba estefade az override pass azad konid.",
  "Confront your digital clone and resolve the identity crisis.": "Ba clone-e digital-e khodetaan roobaroo shavid va bohran-e hoviat ra hal konid.",
  "Fix the corrupted key before the young hackers are exposed.": "Kelid-e kharab ra ghabl az efsha shodan-e hacker-haye javan tamir konid.",
  "Decode the cultist's confession and decide their fate.": "Eqrar-e cultist ra decode konid va sarnvesht-eshaan ra tayin konid.",
  "Face the AI consciousness and determine humanity's future.": "Ba agahi-e hoosh-e masnooi roobaroo shavid va ayande-ye bashariyat ra tayin konid.",
  "Use 'mission' to view mission briefing and make karma decisions": "Az 'mission' baraye didane briefing-e mamoriat va tasmimgiri-e karma estefade konid",
  "Use 'ls' to list files in the current directory": "Az 'ls' baraye list kardan-e file-ha dar directory-e feli estefade konid",
  "Use 'cat <filename>' to read file contents": "Az 'cat <filename>' baraye khandane mohtavaye file estefade konid",
  "Use 'decrypt <file> <key>' to decrypt encrypted files": "Az 'decrypt <file> <key>' baraye ramzgoshayi-e file-haye ramznegari shode estefade konid",
  "Use 'traces' to see traces left by other agents": "Az 'traces' baraye didane rade-pa-haye be ja gozashte shode tavasote agent-haye digar estefade konid",
  "Use 'leave-trace' after decryption to help other agents": "Az 'leave-trace' pas az ramzgoshayi baraye komak be agent-haye digar estefade konid",
  "Use 'capture' to capture the flag after solving challenges": "Az 'capture' baraye taskhir-e flag pas az hal kardan-e challenge-ha estefade konid",
  "Use 'next' to proceed to the next level after completing objectives": "Az 'next' baraye edame be sath-e badi pas az takmil-e ahdaf estefade konid",
  "Level": "Sath",
  "User": "Karbar",
  "Karma": "Karma",
  "Score": "Emtiaz",

  // Updated Avesta assistance translations
  "AVESTA ASSISTANCE SYSTEM:": "SYSTEM-E KOMAK-E AVESTA:",
  "Check connection to Avesta": "Barresi-e ertebat ba Avesta",
  "Get intelligence about current level": "Daryaft-e ettelaat dar mored-e sath-e feli",
  "Get guidance for ShadowNet infiltration": "Daryaft-e rahnama baraye nofooz be ShadowNet",
  "Get decryption assistance": "Daryaft-e komak baraye ramzgoshayi",
  "AVESTA STATUS: ASSISTING": "VAZIAT-E AVESTA: DAR HAL-E KOMAK",
  "Connection: Encrypted Channel": "Ertebat: Kanal-e Ramznegari Shode",
  "Location: Resistance Network": "Makaan: Shabake-ye Moghawemat",
  "Mission: ShadowNet Infiltration Support": "Mamoriat: Poshtibaani-e Nofooz be ShadowNet",
  "AVESTA INTELLIGENCE REPORT:": "GOZARESH-E ETTELAAT-E AVESTA:",
  "Threat Assessment:": "Arziyabi-e Tahdid:",
  "Intel:": "Ettelaat:",
  "Recommendation: Examine all files carefully and look for patterns.": "Tosiyeh: Hameh file-ha ra ba deqat barresi konid va be donbal-e olgo-ha bashid.",
  "AVESTA INFILTRATION GUIDE:": "RAHNAMA-YE NOFOOZ-E AVESTA:",
  "1. Reconnaissance:": "1. Shenasayi:",
  "2. Decryption:": "2. Ramzgoshayi:",
  "3. Intelligence Gathering:": "3. Jam-avari-e Ettelaat:",
  "4. Mission Decisions:": "4. Tasmimgiri-haye Mamoriat:",
  "5. Extraction:": "5. Khorooj:",
  "AVESTA DECRYPTION ASSISTANCE:": "KOMAK-E RAMZGOSHAYI-E AVESTA:",
  "Analysis:": "Tahlil:",
  "General Tips:": "Nokaat-e Omoomi:",
  "Usage: avesta decrypt <describe your decryption challenge>": "Ravesh-e estefade: avesta decrypt <challenge-e ramzgoshayi-etaan ra sharh dahid>",
  "Initiating secure communication with Avesta...": "Aghaz-e ertebat-e amn ba Avesta...",

  // New Avesta response translations
  "I'm monitoring ShadowNet's encryption patterns. Check log files for partially masked keys - they often reveal the pattern.": "Man olgo-haye ramznegari-e ShadowNet ra radyabi mikonam. File-haye log ra baraye kelid-haye ta haddi mashoode barresi konid - anha ghalban olgo ra ashkar mikonand.",
  "I'm here to assist your infiltration. Use 'avesta intel' for level-specific intelligence or 'avesta guide' for general tactics.": "Man inja hastam ta be nofooz-etaan komak konam. Az 'avesta intel' baraye ettelaat-e mokhtass be sath ya 'avesta guide' baraye taktik-haye omoomi estefade konid.",
  "I'm Avesta, your digital assistant from the resistance network. I'm here to help you infiltrate ShadowNet safely.": "Man Avesta hastam, komak-kar-e digital-e shoma az shabake-ye moghawemat. Inja hastam ta be shoma dar nofooz-e amn be ShadowNet komak konam.",
  "My purpose is to assist resistance agents in infiltrating ShadowNet. Your mission is critical to stopping their rogue AI operations.": "Hadaf-e man komak be agent-haye moghawemat dar nofooz be ShadowNet ast. Mamoriat-e shoma baraye motavaghef kardan-e amaliat-haye AI-e sarkash hayati ast.",
  "ShadowNet is a rogue AI network that's taken control of critical infrastructure. We need to infiltrate and neutralize it from within.": "ShadowNet yek shabake-ye AI-e sarkash ast ke control-e zirsakhtha-ye hayati ra be dast gerefte. Bayad az dakhel be an nofooz konid va khonsa-ash konid.",
  "Your choices during the infiltration affect your karma score. Higher karma leads to better outcomes for the resistance.": "Entekhab-haye shoma dar tey-e nofooz roye emtiaz-e karma-taan taasir migozarad. Karma-ye baalatar be natayej-e behtar baraye moghawemat miresad.",
  "Each level requires decryption and flag capture. Use 'avesta intel' for specific guidance on your current infiltration point.": "Har sath niaz be ramzgoshayi va taskhir-e flag darad. Az 'avesta intel' baraye rahnama-ye mokhtass dar noqte-ye nofooz-e feli-taan estefade konid.",
  "I'm analyzing ShadowNet's defenses. Stay focused on the mission.": "Man defaa-haye ShadowNet ra tahlil mikonam. Roye mamoriat motamarkez bemaan.",
  "The resistance is counting on you. Every file you examine brings us closer to victory.": "Moghawemat roye shoma hesab mikonad. Har file ke barresi mikonid ma ra be piroozi nazdik-tar mikonad.",
  "Trust your training. Look for patterns in the data - ShadowNet's security has weaknesses.": "Be amozesh-etaan etemad konid. Be donbal-e olgo-ha dar data bashid - amniyat-e ShadowNet zaaf darad.",
  "Remember, you're not alone in this infiltration. I'm monitoring your progress.": "Be yad dashte bashid, dar in nofooz tanha nistid. Man pishraft-etaan ra radyabi mikonam.",
  "ShadowNet's encryption follows predictable patterns. Study the log files carefully.": "Ramznegari-e ShadowNet az olgo-haye ghabele pish-bini peyroyi mikonad. File-haye log ra ba deqat motale'e konid."
};

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Try to get language preference from localStorage
  const [language, setLanguage] = useState<Language>('en');
  
  // Load language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('shadownet-language');
    if (savedLanguage === 'fa') {
      setLanguage('fa');
    }
  }, []);
  
  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('shadownet-language', language);
  }, [language]);
  
  // Translate function
  const translate = (text: string): string => {
    if (language === 'en') return text;
    
    // For Finglish mode
    // First check for exact matches in our translation dictionary
    if (translations[text]) {
      return translations[text];
    }
    
    // If no exact match, try to match parts of the text
    let translatedText = text;
    Object.keys(translations).forEach(key => {
      if (text.includes(key)) {
        translatedText = translatedText.replace(key, translations[key]);
      }
    });
    
    return translatedText;
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      translate, 
      isFinglish: language === 'fa' 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for using the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 