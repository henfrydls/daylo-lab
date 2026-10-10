# Daylo Lab

A throwaway copy of [Daylo](https://github.com/henfrydls/daylo) that exists to run one
thing end to end before the real one does it in front of people: **the updater**.

It publishes releases the same way Daylo does, with the same workflow and the same
scripts, so that installing one version here and being offered the next is the same
sequence of events a real Daylo puts in front of somebody. It has grown a second job since:
anything that only a phone can judge gets built here first, because the public repository
cannot publish a version nobody has held.

## Where it came from

Built from `henfrydls/daylo` at commit `bb94855`. Nothing here is written by hand except
the differences below, and this tree is not edited in place: every round it is thrown away
and built again from that commit, with those differences applied on top.

That commit is now written by the refresh and not typed, which is the only reason to trust
it. It said v1.4.0 for two refreshes after it had stopped being true, and the same round of
hand editing quietly dropped a comment out of `release.yml`, so this file was claiming a
difference of one place where there were two.

## What is different, and why each one

| Change                                                                  | Why                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` is `com.daylo.lab`                                         | so a lab copy keeps its own data and cannot touch the data of a real Daylo on the same machine                                                                                                                                                                                                                                                  |
| the window title says **Daylo Lab**                                     | so you can tell which one you are looking at. The product name stays `Daylo`, because every artifact name in the release workflow and every pattern in the manifest composer is built from it, and the point of this repository is to run that path unchanged                                                                                   |
| the updater endpoint is this repository's `latest.json`                 | it is the address under test                                                                                                                                                                                                                                                                                                                    |
| the signing key is a **test key**, `F5D1D1CD8B8DFCA9`                   | the key that signs real Daylo updates is not in this repository and never will be. This one signs nothing anybody has installed                                                                                                                                                                                                                 |
| the anonymous check-in is **off at compile time**                       | a lab copy has an empty profile, an empty profile is a new installation, and a new installation turns the check-in on. That would write rows into the panel that counts real installations. It is not an environment variable here, because a variable is something to forget on five runners and again on the machine that installs the result |
| the Android build signs with a key made for that build                  | the real signing key is not in this repository and must not be. Nothing on Android updates over anything, because there is no updater there, so there is nothing for a stable key to protect. The cost: two lab APKs cannot be installed over each other                                                                                        |
| four workflows are gone (Flatpak, MSIX, the MSIX probe, the test build) | none of them is part of the update path, and each one costs runner minutes on a private repository                                                                                                                                                                                                                                              |

`ci.yml` and `.github/scripts/android-smoke.sh` differ only in the identifier their smoke
checks look for. `release.yml` differs in one place, marked in the file: the keystore it
signs Android with. Everything else in both, and every other script they call, is what
`main` has. That is the whole idea: if the manifest composer refuses something here, it
will refuse the same thing there.

## What a release here proves

1. Five platforms build and upload their artifacts and their signatures.
2. `scripts/updater-manifest.js` composes one `latest.json` from them, refusing if a
   platform is missing, if two artifacts claim one platform, or if the release note is
   empty, too long, or word for word the previous one.
3. The address the app actually reads, `/releases/latest/download/latest.json`, gives back
   the version just published.
4. A copy of the earlier version, running, is offered the later one, takes it, verifies the
   signature, installs it and comes back on the new version.

Step 4 is the one nothing else could prove.

## What a release here cannot prove

The differences that make this repository safe also make parts of the application
unreachable, and a round that forgets which parts will report faults that do not exist. One
already did.

- **Send feedback, and the question with the five stars.** The check-in is off at compile
  time here, and the gate that opens that question asks whether the check-in exists. So it
  never opens, and the button falls through to a `mailto:` instead. In a real Daylo the
  question appears. Nothing is wrong with it; it just cannot be seen from here.
- **Anything about the anonymous check-in**, for the same reason: the switch is not there,
  and neither is **What gets sent**, the row that opens into the whole message. On Android
  there is no updater either, so the Privacy section of a lab build is **one row**, Send
  feedback, where a real Daylo on a phone has three. Checked in the code rather than
  assumed: `checkin_fields` returns an error here, the screen asks that command whether the
  check-in exists, and an error means no.
- **Updating an Android build over another.** Each build here is signed with a key made for
  it, so two of them cannot be installed over each other at all.

---

# The round

This one is 1.4.2 as it will go out: a Settings screen that reads as a list, dialogs that
come up and go down instead of appearing, and the day sheet you already saw sliding.

**Uninstall the Daylo Lab you have before installing this one.** Lab builds are signed with
a key made for that build, so one cannot go over another. It installs beside your real
Daylo and touches nothing of it.

Install `Daylo-android-arm64.apk` from the **v1.4.12** release of this repository.

**Write down anything that does not match, in the words you would use to tell somebody what
you saw.** And first of all: **did it open?**

No stopwatch this time. It went out in 1.4.11, came back with no number, and an instrument
nobody reads is one more thing that can break the build that has to be trustworthy. If the
first sheet of a session feels slow again, say so and it comes back.

## 1. Settings, with no lines in it

Open Settings from the corner. **There should be no grey rules between the rows** anywhere:
not between Export and Import, not between Version and Made by, not above the links at the
foot. What tells one row from the next is the space around it. If any two rows read as
glued together, that is worth saying.

At the foot there are now **four links on one line**: Website, Source code, License,
Privacy policy. The policy used to be a row inside the Privacy section and is not there any
more.

## 2. Send feedback, as a row

In the Privacy section, **Send feedback is a row you can press**, with a chevron and a line
under it saying "Only what you type, and only when you press Send." It used to be a word at
the foot of the screen.

**What to look at is how it sits**, not what it does. Pressing it here opens a letter rather
than the question with the five stars, and that is this repository rather than a fault: the
check-in is off at compile time and the question asks the check-in whether it exists.

**And expect the Privacy section to be short here.** One row, Send feedback. Your real Daylo
has the Anonymous check-in switch and What gets sent above it; neither can exist in a lab
build, so neither is something this round can show you. If you want to see those two, they
are in the real 1.4.2 when it goes out.

## 3. Export and Import, opening and closing

Settings → Export. **It should grow into place rather than being suddenly there**, and go
back down the same way when you close it. Same with Import. Before this they appeared and
vanished, which reads as the screen flickering.

Then: open Import, choose a file, close it without importing, and open it again. **It
should be empty**, as if you had never chosen anything.

## 4. The first day you tap

Tap a day. The sheet should come up from the bottom edge and go back down the same way, and
keep the day written on it until it has gone.

**The one thing I want your words on: the first one of a session.** Open the app fresh, tap
a day once, and say whether that first sheet felt slow. The ones after it were always fine;
it is the first that you called slow, and no computer here reproduces it.

## 5. The reminder, on a phone, which is the only place it is real

With the daily reminder **off**, Settings shows one row. Turn it on and the time and the
line about Android's timing **open out**; turn it off and they fold away.

The offer only comes once, so seeing it needs a fresh start: clear Daylo Lab's data, then
make one activity. **It should propose the next hour on the hour** rather than a fixed
time: at 14:37 it offers 15:00. From **ten at night until six in the morning** it offers
8:00 PM instead, because the next hour there is a notification nobody wants.

And one that is easier to describe than to trigger: with the reminder on, delete your last
activity. **The reminder should go off by itself**, because there is nothing left to be
reminded about.

# Publishing a lab release

One tag per round, and each one is a full release: five platforms, their signatures, and
one `latest.json` composed from them. The round before it is the version that gets offered
this one, which is the thing being tested, so there is always a previous release to update
from.

The tree is not edited here. It is rebuilt from Daylo's `main` with the lab differences
applied on top, by the scripts kept outside this repository, and then:

    git add -A && git commit -m "Daylo Lab <version>: ..."
    git push origin main
    # once the push has gone green:
    git tag v<version> && git push origin v<version>

## What to look at in each run

1. **Five Build jobs**, one per platform, and Android, which builds here now so there is an
   APK to try.
2. **Updater manifest → Compose it.** It refuses if a platform is missing, if two artifacts
   claim one platform, or if the release note is empty, too long, or word for word the
   previous one. Five platforms in, Android not among them, because a phone has no updater
   to read a manifest: it has
   `windows-x86_64`, `windows-aarch64`, `darwin-x86_64`, `darwin-aarch64`, `linux-x86_64`.
3. **The address the app reads gives back this version.** This is the step that only a
   published release can answer, and the one this whole repository exists for. It asks
   `https://github.com/henfrydls/daylo-lab/releases/latest/download/latest.json` and
   compares what it says with the tag.
4. The `latest.json` attached to the release: five platforms, each with a `url` under this
   repository and a `signature`.

# The rehearsal that only a lab can do: a signature that does not match

Daylo refuses an update signed by anything other than the key inside it, and says so:
**"That update could not be verified, so nothing was installed."** Nobody should ever see
that sentence in the real app, which is exactly why it is worth seeing once here.

It is prepared and not run. The recipe, for when the ordinary path has been seen working:

1. Generate a second test key, apart from the one this repository publishes with.
2. Replace `TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` in this
   repository's secrets with the second key. **The `pubkey` in `tauri.conf.json` does not
   change**: that is the whole point, the app keeps looking for the first key.
3. Tag `v1.4.2`. It builds and publishes exactly like the others.
4. A lab copy on 1.4.1 is offered 1.4.2, takes it, and stops with that sentence, having
   installed nothing. The app is still on 1.4.1 afterwards, which is the part worth
   checking.
5. Afterwards, delete the 1.4.2 release and put the first key back in the secrets, or every
   lab copy keeps being offered an update it will keep refusing.
