# Graph Report - .  (2026-05-30)

## Corpus Check
- Corpus is ~25,183 words - fits in a single context window. You may not need a graph.

## Summary
- 269 nodes · 374 edges · 22 communities (15 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Frontend UI & Audio|Frontend UI & Audio]]
- [[_COMMUNITY_Frontend Dependencies|Frontend Dependencies]]
- [[_COMMUNITY_Backend Schemas|Backend Schemas]]
- [[_COMMUNITY_Temp Repo Package|Temp Repo Package]]
- [[_COMMUNITY_API & Data Services|API & Data Services]]
- [[_COMMUNITY_Backend CRUD Operations|Backend CRUD Operations]]
- [[_COMMUNITY_Frontend TS Config|Frontend TS Config]]
- [[_COMMUNITY_Temp Repo TS Config|Temp Repo TS Config]]
- [[_COMMUNITY_Backend Main & DB|Backend Main & DB]]
- [[_COMMUNITY_Backend ORM Models|Backend ORM Models]]
- [[_COMMUNITY_Frontend Layout|Frontend Layout]]
- [[_COMMUNITY_Temp Repo Layout|Temp Repo Layout]]
- [[_COMMUNITY_Claude Config|Claude Config]]
- [[_COMMUNITY_Frontend ESLint|Frontend ESLint]]
- [[_COMMUNITY_Frontend Next Config|Frontend Next Config]]
- [[_COMMUNITY_Frontend PostCSS|Frontend PostCSS]]
- [[_COMMUNITY_Temp Repo ESLint|Temp Repo ESLint]]
- [[_COMMUNITY_Temp Repo Next Config|Temp Repo Next Config]]
- [[_COMMUNITY_Temp Repo PostCSS|Temp Repo PostCSS]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `compilerOptions` - 16 edges
3. `Session` - 13 edges
4. `useStore` - 13 edges
5. `Session` - 9 edges
6. `CosmosStore` - 9 edges
7. `int` - 8 edges
8. `int` - 8 edges
9. `AudioManager` - 7 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `useStore`  [EXTRACTED]
  frontend/src/app/page.tsx → frontend/src/store/useStore.ts
- `BlackholeTransition()` --calls--> `useStore`  [EXTRACTED]
  frontend/src/components/BlackholeTransition.tsx → frontend/src/store/useStore.ts
- `CameraController()` --calls--> `useStore`  [EXTRACTED]
  frontend/src/components/CameraController.tsx → frontend/src/store/useStore.ts
- `Planet()` --calls--> `useStore`  [EXTRACTED]
  frontend/src/components/CelestialSystem.tsx → frontend/src/store/useStore.ts
- `CosmosCanvas()` --calls--> `useStore`  [EXTRACTED]
  frontend/src/components/CosmosCanvas.tsx → frontend/src/store/useStore.ts

## Communities (22 total, 7 thin omitted)

### Community 0 - "Frontend UI & Audio"
Cohesion: 0.09
Nodes (15): LOADING_STEPS, BlackholeTransition(), CameraController(), MoonProps, Planet(), PlanetProps, CosmosCanvas(), getTheme() (+7 more)

### Community 1 - "Frontend Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, framer-motion, gsap, lucide-react, next, react, react-dom, @react-three/drei (+21 more)

### Community 2 - "Backend Schemas"
Cohesion: 0.14
Nodes (26): Academic, AcademicBase, AcademicCreate, Config, Project, ProjectBase, ProjectCreate, ResumeCertification (+18 more)

### Community 3 - "Temp Repo Package"
Cohesion: 0.08
Nodes (25): dependencies, next, react, react-dom, @react-three/drei, @react-three/fiber, three, devDependencies (+17 more)

### Community 4 - "API & Data Services"
Cohesion: 0.17
Nodes (13): CosmosState, CosmosStore, PLANET_THEMES, PlanetType, Academic, api, Project, ResumeCertification (+5 more)

### Community 5 - "Backend CRUD Operations"
Cohesion: 0.19
Nodes (20): AcademicCreate, create_academic(), create_project(), create_social(), create_tech_stack(), get_academics(), get_project_by_slug(), get_projects() (+12 more)

### Community 6 - "Frontend TS Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Temp Repo TS Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "Backend Main & DB"
Cohesion: 0.20
Nodes (13): get_db(), read_academics(), read_project(), read_projects(), read_resume_certifications(), read_resume_education(), read_resume_experience(), read_resume_skills() (+5 more)

### Community 9 - "Backend ORM Models"
Cohesion: 0.36
Nodes (9): Academic, Project, ResumeCertification, ResumeEducation, ResumeExperience, ResumeSkill, Social, TechStack (+1 more)

### Community 10 - "Frontend Layout"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 11 - "Temp Repo Layout"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

## Knowledge Gaps
- **108 isolated node(s):** `PreToolUse`, `str`, `ProjectCreate`, `TechStackCreate`, `AcademicCreate` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useStore` connect `Frontend UI & Audio` to `API & Data Services`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `str`, `ProjectCreate` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend UI & Audio` be split into smaller, more focused modules?**
  _Cohesion score 0.08502024291497975 - nodes in this community are weakly interconnected._
- **Should `Frontend Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Backend Schemas` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._
- **Should `Temp Repo Package` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Frontend TS Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._