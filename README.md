# Daylo Lab

A throwaway copy of [Daylo](https://github.com/henfrydls/daylo) that exists to run one
thing end to end before the real one does it in front of people: **the updater**.

It publishes releases the same way Daylo does, with the same workflow and the same
scripts, so that installing one version here and being offered the next is the same
sequence of events a real Daylo puts in front of somebody. It has grown a second job since:
anything that only a phone can judge gets built here first, because the public repository
cannot publish a version nobody has held.

## Where it came from

Built from `henfrydls/daylo` at commit `c6eb322`. Nothing here is written by hand except
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
| a stopwatch in `src/lib/labStopwatch.ts`, started from `main.tsx`       | the first sheet of a session is slow on a phone and on no desktop, so it is timed where it happens and written at the bottom of Settings, which is somewhere to read a number without a cable. It watches from outside and no component of the application knows it is there                                                                    |
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

---

# The round

Everything you asked for last time, and a stopwatch for the one thing we could not find
from here. **Uninstall the Daylo Lab you have before installing this one.** Lab builds are
signed with a key made for that build, so one cannot go over another. It installs beside
your real Daylo and touches nothing of it.

Install `Daylo-android-arm64.apk` from the **v1.4.10** release of this repository.

**Write down anything that does not match, in the words you would use to tell somebody what
you saw.**

## 1. The sheet that flickered

Open Activities and press things: the pencil, a name, anything. **The blurred calendar
behind the sheet should stay blurred.** Before this, every press took the blur off and put
it back, six times in four seconds by your own video.

Then drag the sheet down by its handle. It should follow your finger, and the blur should
fade away as it goes rather than disappearing at the first touch.

## 2. Settings, with your two changes

- The section is called **Privacy** now, and ends with a **Privacy policy** row that opens
  the real page.
- With the daily reminder **off**, there is only the one row. Turn it on and the time and
  the line about Android's timing **open out**; turn it off and they fold away.

## 3. The reminder it offers you

This needs a fresh start to see: the offer only comes once. If you want to try it, clear
Daylo Lab's data first, then make one activity. **It should propose the next hour on the
hour** rather than a fixed time: at 14:37 it offers 15:00. Between eleven at night and
seven in the morning it offers 8:00 PM instead.

## 4. The stopwatch, which is the one for me

You said the first sheet of a session is slow and the rest are fine. It does not happen on
a computer, so this build times it on yours. **Do this in order, on a fresh start:**

1. Open Daylo Lab.
2. Tap a day, once, and watch how slow the sheet is.
3. Close it, open Settings, scroll to the bottom.

There is a grey line at the very end:

> Lab stopwatch: first plugin call 42 ms, first day sheet 310 ms.

**Write both numbers down**, and say whether that first sheet felt slow to you. If it felt
fine this time, say that too: a number without your impression beside it tells me nothing.

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
