# Daylo Lab

A throwaway copy of [Daylo](https://github.com/henfrydls/daylo) that exists to run one
thing end to end before the real one does it in front of people: **the updater**.

It publishes releases the same way Daylo does, with the same workflow and the same
scripts, so that installing one version here and being offered the next is the same
sequence of events that Daylo 1.4.0 will put in front of somebody in a few days.

## Where it came from

Built from `henfrydls/daylo` at commit `f91d6ed`, which is everything in 1.4.1 including
the three things the last round of this repository found. Nothing here is written by hand
except the differences below.

This line said v1.4.0 for two refreshes after it stopped being true: the edit that should
have moved it sat in a script that failed on a later line and wrote nothing. If you are
reading it to know what you are testing, check it against the version in `package.json`,
which is the one thing here that cannot drift.

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

`ci.yml` differs only in the identifier its smoke check looks for. `release.yml` differs in
one place, marked in the file: the keystore it signs Android with. Everything else in both,
and every script they call, is what `main` has. That is the whole idea: if the manifest
composer refuses something here, it will refuse the same thing there.

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

Everything you found last time is in this build. The list below is what to look at, and it
is short on purpose: four of the five are things you already know are wrong, so the
question is only whether they are right now.

**Write down anything that does not match, in the words you would use to tell somebody what
you saw.** A step that goes differently is worth more than a step that goes as written.

Install `Daylo-android-arm64.apk` from the **v1.4.4** release of this repository. **If you
still have the 1.4.2 on the phone, uninstall it first**: lab builds are signed with a key
made for that build, so one cannot be installed over another. It installs beside your real
Daylo and touches nothing of it.

## The five things

**1. Letting go of a slide.** Drag between Year and Month and let go. The view should be
put down rather than snapped into place. It was 140 to 260 ms and it is 280 to 400 now,
and going back is 260. This is the one that only a hand can judge: if it is still fast, or
now slow, say which.

**2. The toggle against the drag.** Tap **Year | Month** and then do the same journey by
dragging. The toggle takes 240 ms, which is now **quicker** than letting go of a drag. That
is the opposite of how the design had it, and it was left alone on purpose so that you
could feel the other two first. Does the tap feel right beside the drag, or should it slow
down to match?

**3. The day sheet with nothing in it.** Open a day before creating any activity. There
should be one button, Create your first activity, and the cross in the corner. **Done is
gone** from that state; it used to sit there doing nothing.

**4. A short view fills the screen.** Go to Year and choose **By activity** with no
activities, or any view that ends early. The white card should reach the bottom of the
screen instead of stopping under its text and leaving grey. Then **drag sideways starting
low down, where the grey used to be**: it should cross to the other view. That whole area
did nothing before.

While you are there: the floating button at the bottom right should still be on top of the
card and not cut off, and a long view, a year with months in it, should still scroll
normally.

**5. The one nobody has tested yet.** In **Month**, start a drag to the right **within a
thumb's width of the left edge of the screen**, where Android's own back gesture lives.
Whatever happens, write down which one won: the app, the system, or neither.

## The back button, again in one line

It was right last time and nothing here touched it, so it is only worth a moment: open a
dialog, press back, the dialog goes and Daylo stays. From the main screen with nothing
open, back still closes Daylo.

# Publishing a lab release

Two tags, in this order. Each one is a full release: five platforms, their signatures, and
one `latest.json` composed from them.

    git tag v1.4.0 && git push origin v1.4.0

Then, once that run is finished:

    npm version patch --no-git-tag-version
    # changelog.d/RELEASE-NOTE.md has to say something different from the previous release:
    # the manifest job refuses a note that is word for word the one before it.
    git commit -am "Daylo Lab 1.4.1: the version there is to update to"
    git tag v1.4.1 && git push origin main v1.4.1

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
