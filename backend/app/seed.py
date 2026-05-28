from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from . import models

def seed_db():
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if we already have projects seeded
        if db.query(models.Project).count() > 0:
            print("Database already contains data. Skipping seeding.")
            return

        print("Seeding database with portfolio items...")

        # 1. Seed Projects (Moons orbiting the Projects Planet)
        projects = [
            models.Project(
                title="FunctionalHealth",
                slug="functional-health",
                description="High-performance healthcare scheduling and clinic management tool.",
                content="### FunctionalHealth\n\nFunctionalHealth is a comprehensive healthcare administration suite designed to minimize clinic bottlenecks, automate patient notifications, and streamline doctor-patient scheduling.\n\n#### Key Features\n- **Real-Time Scheduling:** Dynamic appointment matching and instant scheduling queues using WebSockets.\n- **HIPAA Compliant Data Storage:** Secure patient health record storage with fine-grained role-based access control (RBAC).\n- **Automated Notifications:** Integration with Twilio and SendGrid for automated reminders, lowering patient no-show rates by 40%.\n\n#### Technical Deep Dive\nBuilt using **FastAPI** for high-concurrency async request processing, connected to a **PostgreSQL** database with Redis caching to serve doctor schedules in under 5ms. The user interface is built on **Next.js** for SEO-optimized landing pages and dashboard rendering.",
                image_url="/assets/projects/functional_health.jpg",
                live_url="https://health.functionalloop.com",
                github_url="https://github.com/functionalloop/functional-health",
                tags="Next.js, FastAPI, PostgreSQL, Redis, Tailwind CSS, WebSockets",
                orbit_radius=1.5,
                orbit_speed=0.6
            ),
            models.Project(
                title="FunctionalGreen",
                slug="functional-green",
                description="Carbon-offset and ESG compliance ledger tracking green investments.",
                content="### FunctionalGreen\n\nFunctionalGreen is an ESG tracking engine that enables companies to audit their carbon emissions, buy verified carbon offsets, and generate automated compliance sheets for regulatory reporting.\n\n#### Key Features\n- **Emissions Auditing:** Standardized calculators mapping corporate utility bills and travel data to carbon metrics.\n- **Verified Marketplace:** A decentralized carbon credits marketplace utilizing secure API ledgers to guarantee zero double-counting.\n- **Automated Reporting:** Generates audit-ready PDF/Excel sheets compliant with EU and US carbon disclosures.\n\n#### Technical Deep Dive\nWritten in **Go (Golang)** for high-throughput transactional endpoints. Implements a customized ledger using **PostgreSQL** for strict ACID transactions. The dashboard uses **React** with D3.js charting for interactive visualizations of emission trends over time.",
                image_url="/assets/projects/functional_green.jpg",
                live_url="https://green.functionalloop.com",
                github_url="https://github.com/functionalloop/functional-green",
                tags="React, Go, PostgreSQL, D3.js, Docker, Tailwind CSS",
                orbit_radius=2.5,
                orbit_speed=0.4
            ),
            models.Project(
                title="FunctionalPrint",
                slug="functional-print",
                description="Automated print-on-demand fulfillment gateway and merchant API.",
                content="### FunctionalPrint\n\nFunctionalPrint is a high-availability printing fulfillment API connecting e-commerce platforms (like Shopify or custom setups) directly to local print factories globally, reducing shipping times and carbon footprints.\n\n#### Key Features\n- **Dynamic Routing:** Route orders to print facilities closest to the end customer.\n- **Asset Processing Engine:** Automated image scaling, color profile conversion (RGB to CMYK), and print pre-flight checks.\n- **Merchant Dashboard:** Webhooks and unified analytics showing order statuses, shipping updates, and billing.\n\n#### Technical Deep Dive\nPowered by a serverless architecture on **AWS Lambda** and a **FastAPI** gateway. **Stripe** is used to handle global billing and payouts. Images are stored and optimized on-the-fly using AWS S3 and CloudFront CDN for minimal asset latency.",
                image_url="/assets/projects/functional_print.jpg",
                live_url="https://print.functionalloop.com",
                github_url="https://github.com/functionalloop/functional-print",
                tags="FastAPI, Python, AWS Lambda, Stripe, S3, Next.js",
                orbit_radius=3.5,
                orbit_speed=0.3
            )
        ]
        db.add_all(projects)

        # 2. Seed Tech Stack (Moons orbiting the Tech Stack Planet)
        tech_items = [
            # Frontend
            models.TechStack(name="React & Next.js", category="Frontend", proficiency=5, icon="react"),
            models.TechStack(name="Three.js / WebGL", category="Frontend", proficiency=4, icon="three"),
            models.TechStack(name="Tailwind CSS", category="Frontend", proficiency=5, icon="tailwind"),
            models.TechStack(name="TypeScript", category="Frontend", proficiency=5, icon="typescript"),
            
            # Backend
            models.TechStack(name="FastAPI & Django", category="Backend", proficiency=5, icon="python"),
            models.TechStack(name="Go (Golang)", category="Backend", proficiency=4, icon="go"),
            models.TechStack(name="Node.js & Express", category="Backend", proficiency=5, icon="node"),
            
            # Databases
            models.TechStack(name="PostgreSQL", category="Database", proficiency=5, icon="postgres"),
            models.TechStack(name="Redis", category="Database", proficiency=4, icon="redis"),
            models.TechStack(name="MongoDB", category="Database", proficiency=4, icon="mongodb"),
            
            # DevOps & Tools
            models.TechStack(name="Docker", category="DevOps", proficiency=5, icon="docker"),
            models.TechStack(name="AWS (EC2/S3/Lambda)", category="DevOps", proficiency=4, icon="aws"),
            models.TechStack(name="CI/CD Pipelines", category="DevOps", proficiency=4, icon="cicd")
        ]
        db.add_all(tech_items)

        # 3. Seed Academics (Moons orbiting Academics)
        academic_entries = [
            models.Academic(
                institution="State University of Computer Sciences",
                degree="Bachelor of Science",
                major="Computer Science and Engineering",
                gpa="3.95 / 4.00",
                start_date="2022",
                end_date="2026",
                description="Specialized in Distributed Systems and Computer Graphics. Completed honors thesis on: *Optimizing WebGL Shader Performance in Low-Powered Devices*. Active member of the ACM student chapter."
            ),
            models.Academic(
                institution="Online Advanced Certifications",
                degree="Professional Specialization",
                major="Cloud Native Systems & DevOps",
                gpa="Credentials Verified",
                start_date="2024",
                end_date="2025",
                description="Focus areas: Docker container orchestration, Kubernetes deployment patterns, CI/CD systems, and AWS Serverless infrastructure optimization."
            )
        ]
        db.add_all(academic_entries)

        # 4. Seed Social Links (Moons orbiting Socials)
        socials = [
            models.Social(platform="GitHub", url="https://github.com/tanishq", icon="github"),
            models.Social(platform="LinkedIn", url="https://linkedin.com/in/tanishq", icon="linkedin"),
            models.Social(platform="Twitter/X", url="https://x.com/tanishq", icon="twitter"),
            models.Social(platform="Email", url="mailto:tanishq@functionalloop.com", icon="email"),
            models.Social(platform="Blog", url="https://blog.functionalloop.com", icon="globe")
        ]
        db.add_all(socials)

        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
